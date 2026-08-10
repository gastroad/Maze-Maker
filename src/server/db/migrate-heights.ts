import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { mazes } from './schema';
import { ABSOLUTE_WALL, type MazeDataType } from '../../types/maze';
import { findPath } from '../../utils/findPath';

// mazeData 가 0/1 이분법에서 높이맵(number[][])으로 확장되면서, 기존 미로의
// 벽(1)이 "점프로 넘을 수 있는 턱"으로 해석되게 됐다. 기존 미로는 넘을 수 없는
// 벽으로 설계된 것이므로 2(벽)로 올려 난이도를 보존한다.
//
//   npx tsx src/server/db/migrate-heights.ts            (dry-run: 무엇이 바뀔지만 출력)
//   npx tsx src/server/db/migrate-heights.ts --apply     (실제 반영)
//   npx tsx src/server/db/migrate-heights.ts --apply --with-sample
//
// 이미 2 이상이 섞인 미로는 높이맵으로 만들어진 것으로 보고 건너뛴다.

const APPLY = process.argv.includes('--apply');
const WITH_SAMPLE = process.argv.includes('--with-sample');
// 높이 규칙이 바뀌면 저장된 최적 경로(별점 기준선)도 다시 계산해야 한다.
const RECOMPUTE = process.argv.includes('--recompute-paths');

/** 0/1 로만 이루어진 미로인지 — 그렇지 않으면 이미 높이맵이므로 손대지 않는다. */
function isLegacy(data: MazeDataType): boolean {
  return data.every((row) => row.every((v) => v === 0 || v === 1));
}

function raiseWalls(data: MazeDataType): MazeDataType {
  return data.map((row) => row.map((v) => (v === 1 ? 2 : v)));
}

/**
 * 2층 통로를 처음 보여주는 검증용 미로.
 * 4행이 높이 2 벽으로 완전히 막혀 탑다운으로는 건널 수 없고,
 * 열 3 의 계단(0 → 1 → 2)을 사이드뷰에서 올라 2층으로 넘어가야 한다.
 */
const SAMPLE_MAZE = {
  title: '2층 통로',
  name: 'system',
  mazeSize: { col: 8, row: 8 },
  start: { x: 1, y: 1 },
  end: { x: 6, y: 6 },
  mazeData: [
    [9, 9, 9, 9, 9, 9, 9, 9],
    [9, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 1, 0, 0, 0, 9], // 계단 1단
    [9, 0, 0, 2, 0, 0, 0, 9], // 계단 2단 → 여기서 2층
    [9, 2, 2, 2, 2, 2, 2, 9], // 탑다운으로는 넘을 수 없는 띠
    [9, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 9, 9, 9, 9, 9, 9],
  ] as MazeDataType,
  // A* 는 아직 높이를 모르므로(높이 0 만 통과) 이 미로의 경로를 찾지 못한다.
  // 별점 기준선은 비워 둔다.
  resolvedPath: [],
};

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL 환경변수가 설정되지 않았습니다. .env 를 확인하세요.',
    );
  }
  const db = drizzle(neon(url), { schema: { mazes } });
  const rows = await db.select().from(mazes);

  console.log(`대상 미로 ${rows.length}개\n`);
  let changed = 0;

  for (const row of rows) {
    const values = [...new Set(row.mazeData.flat())].sort((a, b) => a - b);
    if (!isLegacy(row.mazeData)) {
      console.log(`  건너뜀  ${row.title} — 이미 높이맵 (값 ${values})`);
      continue;
    }
    const next = raiseWalls(row.mazeData);
    const nextValues = [...new Set(next.flat())].sort((a, b) => a - b);
    console.log(`  변환    ${row.title} — 값 ${values} → ${nextValues}`);
    changed++;
    if (APPLY) {
      await db
        .update(mazes)
        .set({ mazeData: next })
        .where(eq(mazes.id, row.id));
    }
  }

  if (RECOMPUTE) {
    console.log('\n최적 경로 재계산');
    for (const row of rows) {
      // 방금 벽을 올린 미로는 갱신된 데이터로 계산해야 한다
      const data = isLegacy(row.mazeData)
        ? raiseWalls(row.mazeData)
        : row.mazeData;
      const path = findPath(data, row.start, row.end);
      const before = row.resolvedPath?.length ?? 0;
      if (!path) {
        console.log(`  경로 없음  ${row.title} — 깰 수 없는 미로입니다`);
        continue;
      }
      console.log(`  ${row.title} — ${before}칸 → ${path.length}칸`);
      if (APPLY) {
        await db
          .update(mazes)
          .set({ resolvedPath: path })
          .where(eq(mazes.id, row.id));
      }
    }
  }

  if (WITH_SAMPLE) {
    const exists = rows.some((r) => r.title === SAMPLE_MAZE.title);
    if (exists) {
      console.log(`\n  건너뜀  샘플 "${SAMPLE_MAZE.title}" — 이미 존재`);
    } else {
      console.log(
        `\n  추가    샘플 "${SAMPLE_MAZE.title}" — 계단(0→1→2)과 2층 통로 포함`,
      );
      if (APPLY) await db.insert(mazes).values(SAMPLE_MAZE);
    }
  }

  console.log(
    APPLY
      ? `\n✓ 반영 완료: ${changed}개 변환${WITH_SAMPLE ? ' (+샘플)' : ''}`
      : `\n(dry-run) ${changed}개가 바뀝니다. 실제 반영하려면 --apply 를 붙이세요.`,
  );
  // 절대벽 상수를 실제로 참조해 두어, 값이 바뀌면 이 스크립트도 함께 갱신되게 한다
  if (SAMPLE_MAZE.mazeData[0][0] !== ABSOLUTE_WALL) {
    console.warn('경고: 샘플의 외벽 값이 ABSOLUTE_WALL 과 다릅니다.');
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('마이그레이션 실패:', err);
    process.exit(1);
  });
