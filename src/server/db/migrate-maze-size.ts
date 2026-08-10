import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { mazes } from './schema';

// mazeSize 의 키를 `{ col, row }` 에서 `{ rows, cols }` 로 바로잡는다.
// 옛 이름은 col 이 행 수, row 가 열 수여서 읽는 사람마다 뒤집어 해석했다.
//
//   npx tsx src/server/db/migrate-maze-size.ts           (dry-run)
//   npx tsx src/server/db/migrate-maze-size.ts --apply
//
// 크기의 진짜 원천은 mazeData 이므로 옛 값을 옮겨 담지 않고 mazeData 에서 다시
// 센다. 저장된 값이 실제와 달랐다면 그 사실을 출력한다.

const APPLY = process.argv.includes('--apply');

/** 옛 형식과 새 형식이 섞여 있을 수 있어 둘 다 받는다. */
type AnySize = {
  col?: number;
  row?: number;
  rows?: number;
  cols?: number;
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
    const size = row.mazeSize as AnySize;
    const actualRows = row.mazeData.length;
    const actualCols = row.mazeData[0]?.length ?? 0;

    if (size.rows === actualRows && size.cols === actualCols) {
      console.log(`  건너뜀  ${row.title || '(제목 없음)'} — 이미 정상`);
      continue;
    }

    // 옛 형식에서 col 은 행 수, row 는 열 수였다. 값이 실제와 어긋나면 알린다.
    if (size.col !== undefined && size.col !== actualRows) {
      console.log(
        `  주의    ${row.title || '(제목 없음)'} — 저장된 col=${size.col} 이 실제 행 수 ${actualRows} 와 다름`,
      );
    }
    if (size.row !== undefined && size.row !== actualCols) {
      console.log(
        `  주의    ${row.title || '(제목 없음)'} — 저장된 row=${size.row} 이 실제 열 수 ${actualCols} 와 다름`,
      );
    }

    console.log(
      `  변환    ${row.title || '(제목 없음)'} — ${JSON.stringify(size)} → { rows: ${actualRows}, cols: ${actualCols} }`,
    );
    changed++;
    if (APPLY) {
      await db
        .update(mazes)
        .set({ mazeSize: { rows: actualRows, cols: actualCols } })
        .where(eq(mazes.id, row.id));
    }
  }

  console.log(
    APPLY
      ? `\n✓ 반영 완료: ${changed}개 변환`
      : `\n(dry-run) ${changed}개가 바뀝니다. 실제 반영하려면 --apply 를 붙이세요.`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('마이그레이션 실패:', err);
    process.exit(1);
  });
