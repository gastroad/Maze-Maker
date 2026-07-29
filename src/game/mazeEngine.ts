import type { MazeDataType, PointType } from '@type/maze';

// 좌표계: x = 행(row), y = 열(col). mazeData[x][y] 로 접근한다.
// 물리는 "셀 단위" 연속 좌표로 계산한다. 셀 (r,c) 는 x∈[r,r+1), y∈[c,c+1) 를 차지하고,
// 플레이어 위치(pos)는 그 중심점이다. 렌더 시 셀 크기(px)를 곱해 화면 좌표로 변환한다.

export type Direction = 'up' | 'down' | 'left' | 'right';
export type GameStatus = 'ready' | 'playing' | 'won';

export interface Vec2 {
  x: number;
  y: number;
}

/** 프레임 입력(방향 벡터). x = 행축(아래 +), y = 열축(오른쪽 +). 각 성분 -1~1. */
export interface Input {
  x: number;
  y: number;
}

export interface GameState {
  status: GameStatus;
  pos: Vec2; // 플레이어 중심(셀 단위)
  vel: Vec2; // 속도(셀/초)
  startedAt: number | null; // 첫 입력 시각(ms)
  finishedAt: number | null; // 도착 시각(ms)
}

/** 이동에 필요한 미로 정보(엔진은 이 최소 형태에만 의존한다) */
export interface MazeLike {
  mazeData: MazeDataType;
  start: PointType;
  end: PointType;
}

// ── 튜닝 상수 (게임 느낌은 여기서 조절) ─────────────────────────
export const SPEED = 7; // 최고 속도(셀/초)
export const ACCEL = 70; // 가속도(셀/초²) — 최고속도 도달 ~0.1초
export const FRICTION = 70; // 감속도(셀/초²) — 입력이 없을 때 정지
export const PLAYER_HALF = 0.32; // 플레이어 반경(셀). 1칸 복도 통과 여유 확보
export const WIN_DIST = 0.45; // 도착 판정: 중심이 end 셀 중심에 이만큼 근접하면 승리

// 시간 기반 별점: par 타임 배수 임계값 (작을수록 빠름 = 만점 유지)
export const STAR_RATIO = { three: 2.5, two: 4.5 } as const;

const EPS = 1e-6;

/** 방향키/문자키를 Direction 으로 매핑 (없으면 null) — 키보드 입력용 */
export function keyToDirection(key: string): Direction | null {
  switch (key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      return 'up';
    case 'ArrowDown':
    case 's':
    case 'S':
      return 'down';
    case 'ArrowLeft':
    case 'a':
    case 'A':
      return 'left';
    case 'ArrowRight':
    case 'd':
    case 'D':
      return 'right';
    default:
      return null;
  }
}

/** 미로 시작점 중심에서 대기(ready) 상태로 새 게임을 만든다. */
export function createGame(maze: MazeLike): GameState {
  return {
    status: 'ready',
    pos: { x: maze.start.x + 0.5, y: maze.start.y + 0.5 },
    vel: { x: 0, y: 0 },
    startedAt: null,
    finishedAt: null,
  };
}

/** 경계 밖은 벽으로 취급한다. */
function isWall(mazeData: MazeDataType, r: number, c: number): boolean {
  if (r < 0 || c < 0 || r >= mazeData.length || c >= mazeData[0].length) {
    return true;
  }
  return mazeData[r][c] === 1;
}

/** cur 를 target 쪽으로 maxDelta 만큼만 접근시킨다(오버슈트 없음). */
function approach(cur: number, target: number, maxDelta: number): number {
  if (cur < target) return Math.min(cur + maxDelta, target);
  if (cur > target) return Math.max(cur - maxDelta, target);
  return target;
}

/**
 * 한 축(axis)에 대해 벽 충돌을 해소한다. 이동 방향(vel)의 선단(leading edge)이
 * 벽 셀에 들어갔으면 벽 경계에 딱 맞게 되밀고 hit=true 를 반환한다.
 * 축을 나눠 처리하므로 대각선 이동 시 한 축이 막혀도 다른 축은 미끄러진다.
 */
function resolveAxis(
  mazeData: MazeDataType,
  pos: Vec2,
  axis: 'x' | 'y',
  vel: number,
): { value: number; hit: boolean } {
  const H = PLAYER_HALF;
  if (vel === 0) return { value: axis === 'x' ? pos.x : pos.y, hit: false };

  if (axis === 'x') {
    const cLo = Math.floor(pos.y - H + EPS);
    const cHi = Math.floor(pos.y + H - EPS);
    if (vel > 0) {
      const r = Math.floor(pos.x + H - EPS);
      for (let c = cLo; c <= cHi; c++) {
        if (isWall(mazeData, r, c)) return { value: r - H, hit: true };
      }
    } else {
      const r = Math.floor(pos.x - H + EPS);
      for (let c = cLo; c <= cHi; c++) {
        if (isWall(mazeData, r, c)) return { value: r + 1 + H, hit: true };
      }
    }
    return { value: pos.x, hit: false };
  }

  const rLo = Math.floor(pos.x - H + EPS);
  const rHi = Math.floor(pos.x + H - EPS);
  if (vel > 0) {
    const c = Math.floor(pos.y + H - EPS);
    for (let r = rLo; r <= rHi; r++) {
      if (isWall(mazeData, r, c)) return { value: c - H, hit: true };
    }
  } else {
    const c = Math.floor(pos.y - H + EPS);
    for (let r = rLo; r <= rHi; r++) {
      if (isWall(mazeData, r, c)) return { value: c + 1 + H, hit: true };
    }
  }
  return { value: pos.y, hit: false };
}

/**
 * 물리 한 스텝(dt초)을 전진시킨다. 입력 방향으로 가/감속하고, 위치를 적분한 뒤
 * 축별로 벽 충돌을 해소한다. end 셀 중심에 근접하면 승리 처리한다. 순수 함수.
 */
export function step(
  state: GameState,
  maze: MazeLike,
  input: Input,
  dt: number,
  now: number = Date.now(),
): GameState {
  if (state.status === 'won') return state;

  // 입력 벡터 → 목표 속도 (아날로그 크기 반영, 대각선 정규화)
  const inLen = Math.hypot(input.x, input.y);
  let tvx = 0;
  let tvy = 0;
  if (inLen > 0.001) {
    const mag = Math.min(inLen, 1);
    tvx = (input.x / inLen) * mag * SPEED;
    tvy = (input.y / inLen) * mag * SPEED;
  }

  let vx = approach(state.vel.x, tvx, (tvx !== 0 ? ACCEL : FRICTION) * dt);
  let vy = approach(state.vel.y, tvy, (tvy !== 0 ? ACCEL : FRICTION) * dt);

  const pos: Vec2 = { x: state.pos.x, y: state.pos.y };

  pos.x += vx * dt;
  const rx = resolveAxis(maze.mazeData, pos, 'x', vx);
  pos.x = rx.value;
  if (rx.hit) vx = 0;

  pos.y += vy * dt;
  const ry = resolveAxis(maze.mazeData, pos, 'y', vy);
  pos.y = ry.value;
  if (ry.hit) vy = 0;

  const hasInput = inLen > 0.001;
  const startedAt = state.startedAt ?? (hasInput ? now : null);

  const endCenter = { x: maze.end.x + 0.5, y: maze.end.y + 0.5 };
  const won = Math.hypot(pos.x - endCenter.x, pos.y - endCenter.y) <= WIN_DIST;

  return {
    status: won ? 'won' : startedAt !== null ? 'playing' : 'ready',
    pos,
    vel: { x: vx, y: vy },
    startedAt,
    finishedAt: won ? now : null,
  };
}

/** 경과 시간(ms). 시작 전이면 0, 완료 후면 완료까지의 시간으로 고정된다. */
export function elapsedMs(
  t: { startedAt: number | null; finishedAt: number | null },
  now: number = Date.now(),
): number {
  if (t.startedAt === null) return 0;
  return (t.finishedAt ?? now) - t.startedAt;
}

/** 최적 경로를 최고 속도로 직선 주파했을 때의 이론상 시간(ms). 별점 기준선. */
export function parMs(optimalCells: number): number {
  if (optimalCells <= 0) return 0;
  return (optimalCells / SPEED) * 1000;
}

/**
 * 시간 기반 별점(1~3). 만점(3)에서 시작해 par 타임 대비 오래 걸릴수록 깎인다.
 * 진행 중에도 현재 경과 시간으로 호출하면 실시간으로 별이 줄어드는 표시가 된다.
 */
export function computeStars(timeMs: number, optimalCells: number): number {
  const par = parMs(optimalCells);
  if (par <= 0 || timeMs <= 0) return 3;
  const ratio = timeMs / par;
  if (ratio <= STAR_RATIO.three) return 3;
  if (ratio <= STAR_RATIO.two) return 2;
  return 1;
}

export interface GameResult {
  timeMs: number;
  optimal: number;
  parMs: number;
  stars: number;
}

export function getResult(state: GameState, optimalCells: number): GameResult {
  const timeMs = elapsedMs(state);
  return {
    timeMs,
    optimal: optimalCells,
    parMs: parMs(optimalCells),
    stars: computeStars(timeMs, optimalCells),
  };
}
