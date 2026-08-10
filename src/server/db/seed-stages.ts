import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { and, eq, isNotNull } from 'drizzle-orm';
import { mazes } from './schema';
import {
  ABSOLUTE_WALL,
  type MazeDataType,
  type MazeSizeType,
  type PointType,
} from '../../types/maze';
import { findPath, findPathDetailed } from '../../utils/findPath';
import { generateMaze, reachableFrom } from '../../game/mazeGenerator';

// 캠페인 스테이지 1-1 ~ 5-10 (50개)을 절차 생성해 DB 에 넣는다.
//
//   npx tsx src/server/db/seed-stages.ts             (dry-run: 생성·검증만)
//   npx tsx src/server/db/seed-stages.ts --apply     (실제 반영, 이미 있으면 건너뜀)
//   npx tsx src/server/db/seed-stages.ts --apply --update  (있으면 덮어씀)
//   npx tsx src/server/db/seed-stages.ts --print 3-7 (특정 스테이지를 그려 본다)
//
// 시드는 (레벨, 스테이지)에서 결정적으로 뽑으므로 몇 번을 돌려도 같은 50개가 나온다.
// dry-run 은 DATABASE_URL 이 없어도 돈다 — 맵 자체를 검토하는 게 목적이기 때문이다.

const APPLY = process.argv.includes('--apply');
const UPDATE = process.argv.includes('--update');
const PRINT_AT = process.argv.indexOf('--print');
const PRINT = PRINT_AT >= 0 ? process.argv[PRINT_AT + 1] : undefined;

const STAGES_PER_LEVEL = 10;
/**
 * 스테이지마다 만들어 보는 후보 수. 완전 미로는 시드에 따라 최단 경로가 두 배씩
 * 출렁여서, 검증만 통과한 첫 시드를 그냥 쓰면 크기는 커졌는데 경로는 짧아지는
 * 스테이지가 생긴다. 후보를 여럿 줄 세운 뒤 스테이지 위치에 맞는 분위수를 고른다.
 */
const CANDIDATES = 24;
/** 후보를 모으려 시도할 최대 횟수. 검증에 실패한 시드는 버리고 다음 시드로 넘어간다. */
const MAX_ATTEMPTS = 60;

interface LevelSpec {
  level: number;
  /** 이 레벨이 새로 가르치는 것 — 출력에만 쓴다. */
  teaches: string;
  /** 1스테이지 크기 → 10스테이지 크기 (홀수로 보정된다). */
  minSize: number;
  maxSize: number;
  upperFloor: boolean;
  ledgesAt: (stage: number) => number;
  branchesAt: (stage: number) => number;
}

/**
 * 난이도 곡선은 두 축으로 나눠 잡는다.
 *   레벨    = 무엇을 도입하는가 (평지 → 턱 → 2층 → 조합)
 *   스테이지 = 얼마나 큰가
 * 새 메커닉이 나오는 레벨은 크기를 낮춰 시작해 규칙부터 익히게 한다.
 */
const LEVELS: LevelSpec[] = [
  {
    level: 1,
    teaches: '평지만 (0/2)',
    minSize: 7,
    maxSize: 13,
    upperFloor: false,
    ledgesAt: () => 0,
    branchesAt: () => 0,
  },
  {
    level: 2,
    teaches: '평지, 길어짐',
    minSize: 9,
    maxSize: 17,
    upperFloor: false,
    ledgesAt: () => 0,
    branchesAt: () => 0,
  },
  {
    level: 3,
    teaches: '턱(1) 도입 — 시점 전환이 처음 필요',
    minSize: 9,
    maxSize: 17,
    upperFloor: false,
    // 2개에서 시작해 10개까지 — 지름길이 점점 늘어난다
    ledgesAt: (stage) => 2 + Math.floor(((stage - 1) * 8) / 9),
    branchesAt: () => 0,
  },
  {
    level: 4,
    teaches: '2층 통로 도입',
    minSize: 11,
    maxSize: 19,
    upperFloor: true,
    // 초반 세 판은 2층 하나만 놓고 배우게 하고, 뒤로 갈수록 턱을 다시 섞는다
    ledgesAt: (stage) => Math.floor((stage - 1) / 3),
    branchesAt: (stage) => Math.floor((stage - 1) / 4),
  },
  {
    level: 5,
    teaches: '2층 + 턱 조합, 가장 큼',
    minSize: 13,
    maxSize: 23,
    upperFloor: true,
    ledgesAt: (stage) => 3 + (stage - 1),
    branchesAt: (stage) => 1 + Math.floor((stage - 1) / 3),
  },
];

/** 1스테이지 → 10스테이지를 선형으로 잇고 가장 가까운 홀수로 맞춘다. */
function sizeAt(spec: LevelSpec, stage: number): number {
  const t = (stage - 1) / (STAGES_PER_LEVEL - 1);
  const raw = spec.minSize + (spec.maxSize - spec.minSize) * t;
  return 2 * Math.round((raw - 1) / 2) + 1;
}

/** (레벨, 스테이지, 시도)에서 결정적으로 뽑는 시드. */
function seedAt(level: number, stage: number, attempt: number): number {
  return (level * 100003 + stage * 1009 + attempt * 7919) >>> 0;
}

/**
 * mazeData 에서 실제 크기를 센다 — 크기의 진짜 원천은 언제나 mazeData 다.
 *
 * NOTE: 이 브랜치의 MazeSizeType 은 아직 옛 이름 `{ col, row }` 이고,
 * 옛 규약에서 col 이 행 수, row 가 열 수다. `refactor/maze-size-naming` 의
 * `{ rows, cols }` 가 머지되면 이 함수 한 줄만 고치면 된다. 생성되는 스테이지는
 * 모두 정사각이라 두 표기의 값 자체는 같다.
 */
function sizeOf(mazeData: MazeDataType): MazeSizeType {
  return { rows: mazeData.length, cols: mazeData[0].length };
}

interface StageMaze {
  level: number;
  stage: number;
  title: string;
  mazeData: MazeDataType;
  start: PointType;
  end: PointType;
  resolvedPath: PointType[];
  /**
   * 이동 비용 — 걷기 1칸, 시점 전환 + 점프 2칸. findPath 가 최단 경로를 고를 때
   * 쓰는 가중치와 같다. 턱·2층이 섞이면 칸 수보다 이쪽이 체감 난이도에 가깝다.
   */
  cost: number;
  /** 이 미로를 만든 시드. */
  seed: number;
  ledges: number;
  stairs: number;
  upperCells: number;
  sealed: number;
}

/** 검증 실패 사유. 통과하면 null. */
function inspect(
  mazeData: MazeDataType,
  start: PointType,
  end: PointType,
  spec: LevelSpec,
): string | null {
  const rows = mazeData.length;
  const cols = mazeData[0].length;

  for (let c = 0; c < cols; c++) {
    if (
      mazeData[0][c] !== ABSOLUTE_WALL ||
      mazeData[rows - 1][c] !== ABSOLUTE_WALL
    ) {
      return '위/아래 테두리가 절대벽이 아님';
    }
  }
  for (let r = 0; r < rows; r++) {
    if (
      mazeData[r][0] !== ABSOLUTE_WALL ||
      mazeData[r][cols - 1] !== ABSOLUTE_WALL
    ) {
      return '좌/우 테두리가 절대벽이 아님';
    }
  }
  if (mazeData[start.x][start.y] !== 0) return '시작점이 바닥이 아님';
  if (mazeData[end.x][end.y] !== 0) return '도착점이 바닥이 아님';

  if (!findPath(mazeData, start, end)) return '경로 없음 — 깰 수 없는 미로';

  if (spec.upperFloor) {
    const seen = reachableFrom(mazeData, start);
    let reachedUpper = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!seen[r][c]) continue;
        // 2 → 3 은 점프로 오를 수 있는 높이차라, 봉인이 새면 벽 골격 전체를
        // 타고 다닐 수 있게 된다. 실제로 새는지 여기서 확인한다.
        if (mazeData[r][c] > 2)
          return `높이 ${mazeData[r][c]} 인 (${r},${c}) 에 올라설 수 있음`;
        if (mazeData[r][c] === 2) reachedUpper++;
      }
    }
    if (reachedUpper === 0) return '2층에 올라갈 수 없음 — 계단이 끊겼다';
  }
  return null;
}

/**
 * 후보를 여럿 만들어 검증한 뒤, 이동 비용 순으로 줄 세워 스테이지 위치에 맞는
 * 분위수를 고른다. 크기 곡선만으로는 잡히지 않는 시드 편차를 여기서 눌러 준다.
 * minCost 는 직전 스테이지의 비용 — 레벨 안에서 난이도가 되돌아가지 않게 한다.
 */
function buildStage(spec: LevelSpec, stage: number, minCost = 0): StageMaze {
  const size = sizeAt(spec, stage);
  const ledges = spec.ledgesAt(stage);
  const branches = spec.branchesAt(stage);
  const pool: StageMaze[] = [];
  const reasons: string[] = [];

  for (
    let attempt = 0;
    attempt < MAX_ATTEMPTS && pool.length < CANDIDATES;
    attempt++
  ) {
    const seed = seedAt(spec.level, stage, attempt);
    const { mazeData, start, end } = generateMaze({
      rows: size,
      cols: size,
      seed,
      ledges,
      upperFloor: spec.upperFloor,
      upperBranches: branches,
    });

    const reason = inspect(mazeData, start, end, spec);
    if (reason) {
      reasons.push(`시드 ${seed}: ${reason}`);
      continue;
    }

    // 높이 1 은 턱과 계단이 함께 쓰는 값이다. 계단은 2층 통로와 맞닿아 있고
    // 턱은 (봉인 때문에) 절대 맞닿지 않아, 인접 여부로 정확히 갈라진다.
    let stairs = 0;
    let ledgeCells = 0;
    let upperCells = 0;
    let sealed = 0;
    for (let r = 1; r < mazeData.length - 1; r++) {
      for (let c = 1; c < mazeData[r].length - 1; c++) {
        const h = mazeData[r][c];
        if (h === ABSOLUTE_WALL) sealed++;
        if (h === 2) upperCells++;
        if (h !== 1) continue;
        const touchesUpper = [
          mazeData[r - 1][c],
          mazeData[r + 1][c],
          mazeData[r][c - 1],
          mazeData[r][c + 1],
        ].some((n) => n === 2);
        if (spec.upperFloor && touchesUpper) stairs++;
        else ledgeCells++;
      }
    }

    const detailed = findPathDetailed(mazeData, start, end)!;
    pool.push({
      level: spec.level,
      stage,
      title: `${spec.level}-${stage}`,
      mazeData,
      start,
      end,
      resolvedPath: detailed.map((step) => step.point),
      cost: detailed.reduce((sum, step) => sum + (step.climbed ? 2 : 1), 0),
      seed,
      ledges: ledgeCells,
      stairs,
      upperCells: spec.upperFloor ? upperCells : 0,
      sealed,
    });
  }

  if (pool.length === 0) {
    throw new Error(
      `${spec.level}-${stage} 생성 실패 (${MAX_ATTEMPTS}회 시도)\n  ${reasons.slice(0, 5).join('\n  ')}`,
    );
  }

  // 동점이면 시드 순 — 어느 환경에서 돌려도 같은 미로가 뽑히게 한다
  pool.sort((a, b) => a.cost - b.cost || a.seed - b.seed);
  // 양 끝(최소·최대)은 표본 하나에 휘둘리는 극단값이라 10~90% 구간만 쓴다
  const quantile = 0.1 + (0.8 * (stage - 1)) / (STAGES_PER_LEVEL - 1);
  let index = Math.round(quantile * (pool.length - 1));
  // 크기가 같은 두 스테이지에서 뒤쪽이 더 쉬워지는 일을 막는다
  while (index < pool.length - 1 && pool[index].cost < minCost) index++;
  return pool[index];
}

/** 미로를 글자로 그린다. --print 로 눈으로 확인할 때 쓴다. */
function render(maze: StageMaze): string {
  const glyph: Record<number, string> = {
    0: '  ',
    1: '░░',
    2: '▒▒',
    3: '▓▓',
    [ABSOLUTE_WALL]: '██',
  };
  return maze.mazeData
    .map((row, r) =>
      row
        .map((h, c) => {
          if (r === maze.start.x && c === maze.start.y) return 'St';
          if (r === maze.end.x && c === maze.end.y) return 'En';
          return glyph[h] ?? '??';
        })
        .join(''),
    )
    .join('\n');
}

function pad(value: string | number, width: number): string {
  return String(value).padStart(width);
}

async function main() {
  const built: StageMaze[] = [];
  for (const spec of LEVELS) {
    let minCost = 0;
    for (let stage = 1; stage <= STAGES_PER_LEVEL; stage++) {
      const maze = buildStage(spec, stage, minCost);
      minCost = maze.cost;
      built.push(maze);
    }
  }

  if (PRINT) {
    const target = built.find((m) => m.title === PRINT);
    if (!target) throw new Error(`${PRINT} 스테이지가 없습니다.`);
    console.log(`\n${target.title} (시드 ${target.seed})`);
    console.log(render(target));
    console.log(
      '\n  (빈칸) 바닥(0)   ░░ 턱·계단(1)   ▒▒ 벽(2) — 2층 모드에서는 2층 통로' +
        '\n  ▓▓ 높은 벽(3, 2층에서도 못 넘음)   ██ 절대벽(9)\n',
    );
  }

  console.log('스테이지 생성 결과 (모두 findPath 로 검증됨)\n');
  console.log(
    '  스테이지  크기      경로  비용   턱  계단   2층  봉인       시드',
  );
  for (const spec of LEVELS) {
    const rows = built.filter((m) => m.level === spec.level);
    console.log(`  ── 레벨 ${spec.level}: ${spec.teaches}`);
    for (const m of rows) {
      const size = `${m.mazeData.length}×${m.mazeData[0].length}`;
      console.log(
        `  ${pad(m.title, 8)}  ${size.padEnd(7)}${pad(m.resolvedPath.length, 5)}${pad(m.cost, 6)}${pad(m.ledges, 5)}${pad(m.stairs, 6)}${pad(m.upperCells, 5)}${pad(m.sealed, 6)}${pad(m.seed, 11)}`,
      );
    }
    const avg = rows.reduce((sum, m) => sum + m.cost, 0) / rows.length;
    console.log(
      `     평균 비용 ${avg.toFixed(1)} (1스테이지 ${rows[0].cost} → 10스테이지 ${rows[rows.length - 1].cost})\n`,
    );
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    if (APPLY) {
      throw new Error(
        'DATABASE_URL 이 없어 --apply 를 실행할 수 없습니다. .env 를 확인하세요.',
      );
    }
    console.log(
      `(dry-run) ${built.length}개 생성·검증 완료. DATABASE_URL 이 없어 DB 대조는 건너뜁니다.`,
    );
    return;
  }

  const db = drizzle(neon(url), { schema: { mazes } });
  const existing = await db
    .select({ id: mazes.id, level: mazes.level, stage: mazes.stage })
    .from(mazes)
    .where(and(isNotNull(mazes.level), isNotNull(mazes.stage)));
  const byKey = new Map(
    existing.map((row) => [`${row.level}-${row.stage}`, row.id]),
  );

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const m of built) {
    const values = {
      title: m.title,
      name: 'system',
      level: m.level,
      stage: m.stage,
      mazeSize: sizeOf(m.mazeData),
      mazeData: m.mazeData,
      start: m.start,
      end: m.end,
      resolvedPath: m.resolvedPath,
    };
    const id = byKey.get(m.title);

    if (id === undefined) {
      inserted++;
      if (APPLY) await db.insert(mazes).values(values);
    } else if (UPDATE) {
      updated++;
      if (APPLY) await db.update(mazes).set(values).where(eq(mazes.id, id));
    } else {
      skipped++;
    }
  }

  const summary = `추가 ${inserted}개 / 갱신 ${updated}개 / 건너뜀 ${skipped}개`;
  console.log(
    APPLY
      ? `✓ 반영 완료: ${summary}`
      : `(dry-run) ${summary}. 실제 반영하려면 --apply 를 붙이세요` +
          (skipped > 0 ? ' (덮어쓰려면 --update 도 함께).' : '.'),
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('스테이지 시드 실패:', err);
    process.exit(1);
  });
