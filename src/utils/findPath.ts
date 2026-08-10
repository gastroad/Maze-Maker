import { ABSOLUTE_WALL, type MazeDataType, type PointType } from '@type/maze';
import { JUMP_MAX_HEIGHT } from '@game/mazeEngine';

// 경로 탐색은 플레이어가 실제로 할 수 있는 이동만 따라간다.
//
//   같은 높이   → 그냥 걸어간다
//   낮은 칸     → 떨어진다. 탑다운에서 언제나 가능하다
//   높은 칸     → 시점을 전환해 점프해야 한다. 높이 차가 JUMP_MAX_HEIGHT 이내일 때만
//   절대벽      → 어떤 높이에서도 넘을 수 없다
//
// 플레이어는 늘 지면에 서 있으므로(공중은 경유일 뿐) 상태를 (행, 열)만으로 두고
// 그 칸의 지형 높이를 곧 서 있는 높이로 본다.

/** 한 칸 걷거나 떨어지는 비용. */
const WALK_COST = 1;
/**
 * 한 단 올라가는 비용. 시점 전환과 점프가 필요해 그냥 걷는 것보다 오래 걸리므로
 * 더 비싸게 잡는다. par 타임(별점 기준선)이 이 값에 비례한다.
 */
const CLIMB_COST = 2;

export interface PathStep {
  point: PointType;
  /** 이 칸에 섰을 때의 높이. */
  height: number;
  /** 여기로 오려면 시점 전환 + 점프가 필요했는가. */
  climbed: boolean;
}

/** 키(작을수록 먼저)를 기준으로 셀 인덱스를 꺼내는 이진 힙. */
class MinHeap {
  private keys: number[] = [];
  private vals: number[] = [];

  get size(): number {
    return this.vals.length;
  }

  push(key: number, val: number): void {
    this.keys.push(key);
    this.vals.push(val);
    let i = this.vals.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.keys[parent] <= this.keys[i]) break;
      this.swap(i, parent);
      i = parent;
    }
  }

  pop(): number | undefined {
    if (this.vals.length === 0) return undefined;
    const top = this.vals[0];
    const key = this.keys.pop()!;
    const val = this.vals.pop()!;
    const n = this.vals.length;
    if (n > 0) {
      this.keys[0] = key;
      this.vals[0] = val;
      let i = 0;
      for (;;) {
        const left = i * 2 + 1;
        const right = left + 1;
        let min = i;
        if (left < n && this.keys[left] < this.keys[min]) min = left;
        if (right < n && this.keys[right] < this.keys[min]) min = right;
        if (min === i) break;
        this.swap(i, min);
        i = min;
      }
    }
    return top;
  }

  private swap(a: number, b: number): void {
    const k = this.keys[a];
    this.keys[a] = this.keys[b];
    this.keys[b] = k;
    const v = this.vals[a];
    this.vals[a] = this.vals[b];
    this.vals[b] = v;
  }
}

/** from 높이에서 to 높이의 칸으로 갈 수 있는가. 갈 수 있으면 비용, 아니면 null. */
function moveCost(from: number, to: number): number | null {
  if (to >= ABSOLUTE_WALL) return null;
  if (to <= from) return WALK_COST; // 같은 층이거나 아래 — 걷거나 떨어진다
  if (to - from <= JUMP_MAX_HEIGHT) return CLIMB_COST; // 전환 + 점프
  return null;
}

/**
 * 시작에서 도착까지의 최단 경로(시작점 제외, 도착점 포함).
 * 갈 수 없으면 null.
 */
export function findPathDetailed(
  maze: MazeDataType,
  start: PointType,
  end: PointType,
): PathStep[] | null {
  const rows = maze.length;
  const cols = maze[0]?.length ?? 0;
  if (rows === 0 || cols === 0) return null;

  const inside = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < rows && y < cols;
  if (!inside(start.x, start.y) || !inside(end.x, end.y)) return null;
  if (maze[start.x][start.y] >= ABSOLUTE_WALL) return null;
  if (maze[end.x][end.y] >= ABSOLUTE_WALL) return null;

  const size = rows * cols;
  const idx = (x: number, y: number) => x * cols + y;
  const startIdx = idx(start.x, start.y);
  const endIdx = idx(end.x, end.y);

  const gScore = new Float64Array(size).fill(Infinity);
  const cameFrom = new Int32Array(size).fill(-1);
  const closed = new Uint8Array(size);

  // 맨해튼 거리 × 최소 이동 비용 — 실제 비용을 넘지 않으므로 최단 경로를 보장한다
  const heuristic = (x: number, y: number) =>
    (Math.abs(x - end.x) + Math.abs(y - end.y)) * WALK_COST;

  const open = new MinHeap();
  gScore[startIdx] = 0;
  open.push(heuristic(start.x, start.y), startIdx);

  while (open.size > 0) {
    const current = open.pop()!;
    if (current === endIdx) break;
    if (closed[current]) continue;
    closed[current] = 1;

    const x = (current / cols) | 0;
    const y = current - x * cols;
    const here = maze[x][y];

    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (!inside(nx, ny)) continue;
      const next = idx(nx, ny);
      if (closed[next]) continue;

      const cost = moveCost(here, maze[nx][ny]);
      if (cost === null) continue;

      const tentative = gScore[current] + cost;
      if (tentative >= gScore[next]) continue;
      gScore[next] = tentative;
      cameFrom[next] = current;
      open.push(tentative + heuristic(nx, ny), next);
    }
  }

  if (gScore[endIdx] === Infinity) return null;

  const path: PathStep[] = [];
  for (let at = endIdx; at !== startIdx && at !== -1; at = cameFrom[at]) {
    const x = (at / cols) | 0;
    const y = at - x * cols;
    const prev = cameFrom[at];
    const prevHeight =
      prev === -1 ? maze[x][y] : maze[(prev / cols) | 0][prev % cols];
    path.push({
      point: { x, y },
      height: maze[x][y],
      climbed: maze[x][y] > prevHeight,
    });
  }
  return path.reverse();
}

/** 좌표만 필요한 호출부(별점 기준선·정답 표시)를 위한 얇은 래퍼. */
export function findPath(
  maze: MazeDataType,
  start: PointType,
  end: PointType,
): PointType[] | null {
  return findPathDetailed(maze, start, end)?.map((step) => step.point) ?? null;
}
