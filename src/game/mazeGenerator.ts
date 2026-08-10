import { ABSOLUTE_WALL, type MazeDataType, type PointType } from '@type/maze';
import { JUMP_MAX_HEIGHT } from '@game/mazeEngine';

// 절차적 미로 생성기 — 시드 하나로 재현 가능한 높이맵 미로를 만든다.
//
// 골격은 Recursive Backtracker(완전 미로)다. 홀수 좌표가 방, 그 사이 칸이 벽이고,
// 바깥 테두리는 절대벽(9)으로 감싼다. 테두리를 9 로 두지 않으면 계단을 타고
// 맵 밖으로 걸어나갈 수 있다.
//
// 그 위에 두 가지 높이 장치를 얹는다.
//
//   턱(1)   양옆이 모두 통로인 벽 칸만 낮춘다. "탑다운으로는 막혔지만 시점을 돌려
//           넘으면 질러가는 길"이 되어, 플레이어가 규칙을 학습할 수 있다.
//           아무 벽이나 무작위로 낮추면 넘어지는 벽과 아닌 벽을 구별할 수 없다.
//
//   2층(2)  벽 골격 위를 달리는 제한된 통로. 자세한 사정은 buildUpperFloor 참고.
//
// Math.random() 은 쓰지 않는다 — 시드가 같으면 언제 어디서 돌려도 같은 미로다.

/** 지형 높이 이름. 의미는 @type/maze 의 규약과 같다. */
const FLOOR = 0;
const LEDGE = 1;
const UPPER = 2; // 2층 통로로 쓰는 높이
const HIGH_WALL = 3; // 2층 모드의 기본 벽

/** 미로가 성립하는 최소 크기(방 2×2 + 테두리). */
const MIN_SIZE = 5;

/** 4방향 이웃 오프셋. 플레이어는 대각선으로 움직이지 않는다. */
const NEIGHBORS: ReadonlyArray<readonly [number, number]> = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

export interface GenerateOptions {
  /** 행 수. 홀수가 아니면 홀수로 보정된다. */
  rows: number;
  /** 열 수. 홀수가 아니면 홀수로 보정된다. */
  cols: number;
  /** 같은 시드 = 같은 미로. */
  seed: number;
  /** 높이 1 턱의 개수 (기본 0). 후보가 모자라면 있는 만큼만 놓는다. */
  ledges?: number;
  /** 2층 통로를 만들지 (기본 false). */
  upperFloor?: boolean;
  /**
   * 2층 통로에 덧붙일 곁가지 수 (기본 0, upperFloor 일 때만 의미 있음).
   * 스테이지가 올라갈수록 2층의 양을 늘리기 위한 확장 옵션이다.
   */
  upperBranches?: number;
}

export interface GeneratedMaze {
  mazeData: MazeDataType;
  start: PointType;
  end: PointType;
}

/**
 * mulberry32 — 32비트 시드 하나로 도는 작고 빠른 PRNG.
 * 외부 의존이 없어 브라우저·Node·테스트에서 완전히 같은 수열을 낸다.
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 홀수 보정 — 짝수(또는 이상한 값)가 들어오면 위쪽 홀수로 맞춘다. */
function toOdd(value: number): number {
  if (!Number.isFinite(value)) return MIN_SIZE;
  const n = Math.max(MIN_SIZE, Math.floor(value));
  return n % 2 === 1 ? n : n + 1;
}

/** 시드 PRNG 로 도는 Fisher-Yates. 배열을 제자리에서 섞고 그대로 돌려준다. */
function shuffle<T>(arr: T[], rand: () => number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

/**
 * 발 높이 from 에서 높이 to 인 칸으로 올라설 수 있는가.
 * findPath 의 이동 규칙과 같은 판정이며, JUMP_MAX_HEIGHT 를 직접 참조하므로
 * 점프 성능을 손보면 생성기의 봉인 규칙도 자동으로 따라간다.
 */
function climbable(from: number, to: number): boolean {
  return to < ABSOLUTE_WALL && to - from <= JUMP_MAX_HEIGHT;
}

/** Recursive Backtracker — 방(홀수 좌표)을 잇는 완전 미로를 판다. */
function carve(
  data: MazeDataType,
  rows: number,
  cols: number,
  rand: () => number,
): void {
  const visited = Array.from({ length: rows }, () =>
    new Array<boolean>(cols).fill(false),
  );
  const dirs: Array<[number, number]> = [
    [-2, 0],
    [2, 0],
    [0, -2],
    [0, 2],
  ];

  const stack: Array<[number, number]> = [[1, 1]];
  visited[1][1] = true;
  data[1][1] = FLOOR;

  while (stack.length > 0) {
    const [r, c] = stack[stack.length - 1];
    let moved = false;
    for (const [dr, dc] of shuffle(dirs.slice(), rand)) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 1 || nc < 1 || nr > rows - 2 || nc > cols - 2) continue;
      if (visited[nr][nc]) continue;
      visited[nr][nc] = true;
      data[r + dr / 2][c + dc / 2] = FLOOR; // 두 방 사이의 벽을 헐어 잇는다
      data[nr][nc] = FLOOR;
      stack.push([nr, nc]);
      moved = true;
      break;
    }
    if (!moved) stack.pop();
  }
}

interface BfsResult {
  dist: Map<number, number>;
  parent: Map<number, number>;
}

/** allowed 안에서만 도는 다중 시작점 BFS. 셀은 r * cols + c 로 인코딩한다. */
function bfsCells(
  sources: readonly number[],
  allowed: ReadonlySet<number>,
  cols: number,
): BfsResult {
  const dist = new Map<number, number>();
  const parent = new Map<number, number>();
  const queue: number[] = [];

  for (const s of sources) {
    if (!allowed.has(s) || dist.has(s)) continue;
    dist.set(s, 0);
    queue.push(s);
  }

  for (let head = 0; head < queue.length; head++) {
    const cur = queue[head];
    const r = Math.floor(cur / cols);
    const c = cur - r * cols;
    for (const [dr, dc] of NEIGHBORS) {
      const nc = c + dc;
      if (nc < 0 || nc >= cols) continue; // 열 경계를 넘어 감기는 인덱스 차단
      const next = (r + dr) * cols + nc;
      if (!allowed.has(next) || dist.has(next)) continue;
      dist.set(next, dist.get(cur)! + 1);
      parent.set(next, cur);
      queue.push(next);
    }
  }
  return { dist, parent };
}

/** order 순서로 훑어 가장 먼 칸을 고른다(동점이면 앞선 것 — 결과가 결정적이다). */
function farthestCell(
  dist: ReadonlyMap<number, number>,
  order: readonly number[],
): number | null {
  let best: number | null = null;
  let bestDist = -1;
  for (const cell of order) {
    const d = dist.get(cell);
    if (d === undefined || d <= bestDist) continue;
    best = cell;
    bestDist = d;
  }
  return best;
}

/** parent 를 거슬러 올라가 시작점까지의 경로를 모은다. */
function tracePath(
  target: number,
  parent: ReadonlyMap<number, number>,
): number[] {
  const path = [target];
  let cur = target;
  while (parent.has(cur)) {
    cur = parent.get(cur)!;
    path.push(cur);
  }
  return path;
}

/** 내부 벽 칸(HIGH_WALL)들의 4연결 성분을 인덱스 오름차순으로 돌려준다. */
function wallComponents(
  data: MazeDataType,
  rows: number,
  cols: number,
): number[][] {
  const all = new Set<number>();
  const order: number[] = [];
  for (let r = 1; r <= rows - 2; r++) {
    for (let c = 1; c <= cols - 2; c++) {
      if (data[r][c] !== HIGH_WALL) continue;
      const i = r * cols + c;
      all.add(i);
      order.push(i);
    }
  }

  const seen = new Set<number>();
  const comps: number[][] = [];
  for (const s of order) {
    if (seen.has(s)) continue;
    const { dist } = bfsCells([s], all, cols);
    const cells = [...dist.keys()].sort((a, b) => a - b);
    for (const cell of cells) seen.add(cell);
    comps.push(cells);
  }
  return comps;
}

/**
 * 2층 통로를 얹는다.
 *
 * 완전 미로의 벽은 하나로 이어져 있어서, 벽을 전부 같은 높이로 두고 계단만 놓으면
 * 2층에서 어디든 갈 수 있어 미로가 무의미해진다. 그래서
 *
 *   1. 내부 벽의 기본 높이를 3 으로 올리고
 *   2. 벽 골격 위에서 가장 긴 길(대략적 지름)만 골라 2 로 낮춰 2층 통로로 쓰고
 *   3. 그 통로에 인접한 벽 칸 중 지상 통로와도 맞닿은 곳을 1(계단)로 낮춰 올라갈 길을 내고
 *   4. **통로에 인접한 나머지 3 칸을 절대벽(9)으로 봉인**한다
 *
 * 4번이 핵심이다. 점프 최대 높이가 약 1.45칸이라 2 에서 3 으로는 **올라갈 수 있다** —
 * 3 으로 올려두는 것만으로는 2층에서 벽 골격 전체를 타고 다니는 걸 막지 못한다.
 * 통로와 맞닿은 칸만 봉인하면 발 높이가 2 를 넘는 일이 아예 없어져, 3 인 칸에는
 * 어떤 경로로도 발을 디딜 수 없다(= 나머지 벽은 3 그대로 두어도 안전하다).
 *
 * 지상 미로는 전혀 건드리지 않는다. 통로·계단·봉인은 모두 "이미 벽인 칸"만 바꾸므로
 * 완전 미로의 연결성이 그대로 남고, start→end 경로는 언제나 존재한다.
 */
function buildUpperFloor(
  data: MazeDataType,
  rows: number,
  cols: number,
  branches: number,
  rand: () => number,
): void {
  const comps = wallComponents(data, rows, cols);
  if (comps.length === 0) return;

  // 가장 큰 성분을 2층 무대로 쓴다
  const stage = comps.reduce((a, b) => (b.length > a.length ? b : a));
  const allowed = new Set(stage);

  // 지름의 근사 — 아무 칸에서 가장 먼 칸 A, A 에서 가장 먼 칸 B 를 잇는 길
  const first = bfsCells([stage[0]], allowed, cols);
  const a = farthestCell(first.dist, stage);
  if (a === null) return;
  const second = bfsCells([a], allowed, cols);
  const b = farthestCell(second.dist, stage);
  if (b === null) return;

  const corridor = new Set(tracePath(b, second.parent));

  // 곁가지 — 이미 만든 통로에서 가장 먼 칸까지 한 갈래씩 더 뻗는다
  for (let i = 0; i < branches; i++) {
    const sources = [...corridor].sort((x, y) => x - y);
    const grown = bfsCells(sources, allowed, cols);
    const far = farthestCell(grown.dist, stage);
    if (far === null || (grown.dist.get(far) ?? 0) === 0) break;
    for (const cell of tracePath(far, grown.parent)) corridor.add(cell);
  }

  for (const cell of corridor) {
    data[Math.floor(cell / cols)][cell % cols] = UPPER;
  }

  placeStairs(data, rows, cols, corridor, branches + 1, rand);

  // 봉인 — 통로에서 한 단 점프로 올라설 수 있는 칸을 모두 절대벽으로
  for (const cell of corridor) {
    const r = Math.floor(cell / cols);
    const c = cell % cols;
    for (const [dr, dc] of NEIGHBORS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      const h = data[nr][nc];
      if (h > UPPER && climbable(UPPER, h)) data[nr][nc] = ABSOLUTE_WALL;
    }
  }
}

/**
 * 계단(1)을 놓는다. 지상 통로(0)와 2층 통로(2) 양쪽에 맞닿은 벽 칸이 이상적이다 —
 * 0 → 1 → 2 로 두 번 올라가면 되고, 지상 미로는 손대지 않는다.
 * 그런 칸이 없으면(아주 작은 미로) 통로에 붙은 지상 칸 자체를 턱으로 올린다.
 */
function placeStairs(
  data: MazeDataType,
  rows: number,
  cols: number,
  corridor: ReadonlySet<number>,
  count: number,
  rand: () => number,
): void {
  const candidates: number[] = [];
  const fallback: number[] = [];

  for (let r = 1; r <= rows - 2; r++) {
    for (let c = 1; c <= cols - 2; c++) {
      const here = data[r][c];
      if (here !== HIGH_WALL && here !== FLOOR) continue;
      let touchesCorridor = false;
      let touchesFloor = false;
      for (const [dr, dc] of NEIGHBORS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (corridor.has(nr * cols + nc)) touchesCorridor = true;
        if (data[nr][nc] === FLOOR) touchesFloor = true;
      }
      if (!touchesCorridor) continue;
      if (here === HIGH_WALL && touchesFloor) candidates.push(r * cols + c);
      else if (here === FLOOR) fallback.push(r * cols + c);
    }
  }

  const pool = candidates.length > 0 ? candidates : fallback;
  if (pool.length === 0) return;
  for (const cell of shuffle(pool.slice(), rand).slice(0, Math.max(1, count))) {
    data[Math.floor(cell / cols)][cell % cols] = LEDGE;
  }
}

/**
 * 턱(1)을 놓는다. 후보는 **양옆(상하 또는 좌우)이 모두 통로인 벽 칸**뿐이다.
 * 그래야 "넘으면 반대편 통로로 이어지는 지름길"이 되고, 플레이어가 어떤 벽이
 * 넘어지는 벽인지 학습할 수 있다. 실제로 놓은 개수를 돌려준다.
 */
function placeLedges(
  data: MazeDataType,
  rows: number,
  cols: number,
  wallHeight: number,
  count: number,
  rand: () => number,
): number {
  if (count <= 0) return 0;
  const candidates: number[] = [];
  for (let r = 1; r <= rows - 2; r++) {
    for (let c = 1; c <= cols - 2; c++) {
      if (data[r][c] !== wallHeight) continue;
      const vertical = data[r - 1][c] === FLOOR && data[r + 1][c] === FLOOR;
      const horizontal = data[r][c - 1] === FLOOR && data[r][c + 1] === FLOOR;
      if (vertical || horizontal) candidates.push(r * cols + c);
    }
  }

  const picked = shuffle(candidates, rand).slice(0, count);
  for (const cell of picked) {
    data[Math.floor(cell / cols)][cell % cols] = LEDGE;
  }
  return picked.length;
}

/**
 * 시드로 재현 가능한 미로 하나를 만든다. 순수 함수 —
 * 같은 옵션이면 언제 어디서 돌려도 완전히 같은 결과를 낸다.
 */
export function generateMaze(opts: GenerateOptions): GeneratedMaze {
  const rows = toOdd(opts.rows);
  const cols = toOdd(opts.cols);
  const rand = mulberry32(opts.seed);
  const upperFloor = opts.upperFloor ?? false;
  const wallHeight = upperFloor ? HIGH_WALL : UPPER;

  // 테두리는 절대벽, 내부는 전부 벽으로 채운 뒤 길을 판다
  const mazeData: MazeDataType = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) =>
      r === 0 || c === 0 || r === rows - 1 || c === cols - 1
        ? ABSOLUTE_WALL
        : wallHeight,
    ),
  );

  carve(mazeData, rows, cols, rand);

  // 2층을 먼저 세운다 — 봉인(9)까지 끝난 뒤라야 턱 후보가 정확해진다
  if (upperFloor) {
    buildUpperFloor(mazeData, rows, cols, opts.upperBranches ?? 0, rand);
  }
  placeLedges(mazeData, rows, cols, wallHeight, opts.ledges ?? 0, rand);

  return {
    mazeData,
    start: { x: 1, y: 1 },
    end: { x: rows - 2, y: cols - 2 },
  };
}

/**
 * start 에서 실제 이동 규칙(걷기·낙하·한 단 점프)으로 닿을 수 있는 칸 표.
 * 생성한 미로가 의도한 만큼만 열려 있는지 — 특히 2층에서 벽 골격 전체로
 * 새어나가지 않는지 — 검증하는 데 쓴다.
 */
export function reachableFrom(
  mazeData: MazeDataType,
  start: PointType,
): boolean[][] {
  const rows = mazeData.length;
  const cols = mazeData[0]?.length ?? 0;
  const seen = Array.from({ length: rows }, () =>
    new Array<boolean>(cols).fill(false),
  );
  if (rows === 0 || cols === 0) return seen;
  if (mazeData[start.x][start.y] >= ABSOLUTE_WALL) return seen;

  seen[start.x][start.y] = true;
  const queue: Array<[number, number]> = [[start.x, start.y]];
  for (let head = 0; head < queue.length; head++) {
    const [r, c] = queue[head];
    const here = mazeData[r][c];
    for (const [dr, dc] of NEIGHBORS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (seen[nr][nc]) continue;
      if (!climbable(here, mazeData[nr][nc])) continue;
      seen[nr][nc] = true;
      queue.push([nr, nc]);
    }
  }
  return seen;
}
