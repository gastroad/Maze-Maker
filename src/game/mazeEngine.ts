import { ABSOLUTE_WALL, type MazeDataType, type PointType } from '@type/maze';

// 좌표계: x = 행(row), y = 열(col). mazeData[x][y] 로 접근한다.
// 물리는 "셀 단위" 연속 좌표로 계산한다. 셀 (r,c) 는 x∈[r,r+1), y∈[c,c+1) 를 차지하고,
// 플레이어 위치(pos)는 그 중심점이다. 렌더 시 셀 크기(px)를 곱해 화면 좌표로 변환한다.
//
// 높이(z)는 세 번째 축이다. mazeData 의 값은 그 칸의 지형 높이이고, 플레이어는
// 자기 발 높이(z)보다 높은 칸에는 들어갈 수 없다. 즉 같은 데이터가
//   탑다운  → 통과 가능 여부
//   사이드뷰 → 지형의 높이
// 로 해석된다. 시점 전환은 미로의 한 줄(슬라이스)을 그대로 세우는 것이다.

export type Direction = 'up' | 'down' | 'left' | 'right';
export type GameStatus = 'ready' | 'playing' | 'won';

/** 시점. top = 위에서 내려다봄, side = 한 줄을 옆에서 봄(플랫포머) */
export type ViewMode = 'top' | 'side';

/** 슬라이스 축. col = 열 고정(행이 화면 가로), row = 행 고정(열이 화면 가로) */
export type SliceAxis = 'col' | 'row';

export interface Vec2 {
  x: number;
  y: number;
}

/**
 * 프레임 입력. 탑다운에서는 이동 방향(x = 행축 아래 +, y = 열축 오른쪽 +),
 * 사이드뷰에서는 화면 기준으로 해석한다 — y = 화면 좌우, x < 0(위) = 점프.
 * 각 성분 -1~1.
 */
export interface Input {
  x: number;
  y: number;
}

export interface GameState {
  status: GameStatus;
  mode: ViewMode;
  pos: Vec2; // 플레이어 중심(셀 단위)
  vel: Vec2; // 속도(셀/초)
  z: number; // 발 높이(셀 단위). 0 = 바닥
  vz: number; // 수직 속도(셀/초)
  grounded: boolean; // 지면에 닿아 있는가(점프·시점 복귀의 전제)
  axis: SliceAxis; // side 모드에서 고정된 축
  fixed: number; // 고정된 인덱스(열 번호 또는 행 번호)
  lastMove: 'v' | 'h'; // 마지막 이동 방향 — 전환 축을 정한다
  facing: number; // 사이드뷰에서 바라보는 방향(-1 | 1)
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
export const SPEED = 7; // 탑다운 최고 속도(셀/초)
export const ACCEL = 70; // 가속도(셀/초²) — 최고속도 도달 ~0.1초
export const FRICTION = 70; // 감속도(셀/초²) — 입력이 없을 때 정지
export const PLAYER_HALF = 0.32; // 플레이어 반경(셀). 1칸 복도 통과 여유 확보
export const WIN_DIST = 0.45; // 도착 판정: 중심이 end 셀 중심에 이만큼 근접하면 승리

export const SIDE_SPEED = 5; // 사이드뷰 가로 속도(셀/초)
export const GRAVITY = 22; // 중력 가속도(셀/초²)
export const JUMP_V = 8; // 점프 초기 속도(셀/초)

/**
 * 점프로 오를 수 있는 최대 높이 ≈ 1.4545칸.
 * 높이 1은 넘고 2는 못 넘는 이 경계가 맵 디자인의 기준선이다.
 * (높이 1 위에서 점프하면 2에, 2 위에서는 3에 올라설 수 있다 — 계단 설계의 근거)
 */
export const JUMP_MAX_HEIGHT = (JUMP_V * JUMP_V) / (2 * GRAVITY);

/** 도착 판정에서 허용하는 높이 오차. end 셀과 다른 층을 지나가면 승리하지 않는다. */
export const WIN_Z_TOLERANCE = 0.6;

// 시간 기반 별점: par 타임 배수 임계값 (작을수록 빠름 = 만점 유지)
export const STAR_RATIO = { three: 2.5, two: 4.5 } as const;

const EPS = 1e-6;

/** 경계 밖은 절대벽으로 취급한다(어떤 높이에서도 넘을 수 없다). */
export function heightAt(
  mazeData: MazeDataType,
  r: number,
  c: number,
): number {
  if (r < 0 || c < 0 || r >= mazeData.length || c >= mazeData[0].length) {
    return ABSOLUTE_WALL;
  }
  return mazeData[r][c];
}

/** 발 높이 z 에서 그 칸에 들어갈 수 있는가. */
function isBlocked(
  mazeData: MazeDataType,
  r: number,
  c: number,
  z: number,
): boolean {
  return heightAt(mazeData, r, c) > z + EPS;
}

/** 미로의 한 줄을 잘라낸 지형 높이 배열. 사이드뷰는 이 배열 하나만 본다. */
export function sliceTerrain(
  mazeData: MazeDataType,
  axis: SliceAxis,
  fixed: number,
): number[] {
  return axis === 'col'
    ? mazeData.map((row) => row[fixed])
    : mazeData[fixed].slice();
}

/** 미로 시작점 중심에서 대기(ready) 상태로 새 게임을 만든다. */
export function createGame(maze: MazeLike): GameState {
  return {
    status: 'ready',
    mode: 'top',
    pos: { x: maze.start.x + 0.5, y: maze.start.y + 0.5 },
    vel: { x: 0, y: 0 },
    z: heightAt(maze.mazeData, maze.start.x, maze.start.y),
    vz: 0,
    grounded: true,
    axis: 'col',
    fixed: maze.start.y,
    lastMove: 'v',
    facing: 1,
    startedAt: null,
    finishedAt: null,
  };
}

/** cur 를 target 쪽으로 maxDelta 만큼만 접근시킨다(오버슈트 없음). */
function approach(cur: number, target: number, maxDelta: number): number {
  if (cur < target) return Math.min(cur + maxDelta, target);
  if (cur > target) return Math.max(cur - maxDelta, target);
  return target;
}

/**
 * 한 축(axis)에 대해 벽 충돌을 해소한다. 이동 방향(vel)의 선단(leading edge)이
 * 발 높이 z 로는 들어갈 수 없는 칸에 걸치면 경계에 딱 맞게 되밀고 hit=true 를 반환한다.
 * 축을 나눠 처리하므로 대각선 이동 시 한 축이 막혀도 다른 축은 미끄러진다.
 */
function resolveAxis(
  mazeData: MazeDataType,
  pos: Vec2,
  axis: 'x' | 'y',
  vel: number,
  z: number,
): { value: number; hit: boolean } {
  const H = PLAYER_HALF;
  if (vel === 0) return { value: axis === 'x' ? pos.x : pos.y, hit: false };

  if (axis === 'x') {
    const cLo = Math.floor(pos.y - H + EPS);
    const cHi = Math.floor(pos.y + H - EPS);
    if (vel > 0) {
      const r = Math.floor(pos.x + H - EPS);
      for (let c = cLo; c <= cHi; c++) {
        if (isBlocked(mazeData, r, c, z)) return { value: r - H, hit: true };
      }
    } else {
      const r = Math.floor(pos.x - H + EPS);
      for (let c = cLo; c <= cHi; c++) {
        if (isBlocked(mazeData, r, c, z)) return { value: r + 1 + H, hit: true };
      }
    }
    return { value: pos.x, hit: false };
  }

  const rLo = Math.floor(pos.x - H + EPS);
  const rHi = Math.floor(pos.x + H - EPS);
  if (vel > 0) {
    const c = Math.floor(pos.y + H - EPS);
    for (let r = rLo; r <= rHi; r++) {
      if (isBlocked(mazeData, r, c, z)) return { value: c - H, hit: true };
    }
  } else {
    const c = Math.floor(pos.y - H + EPS);
    for (let r = rLo; r <= rHi; r++) {
      if (isBlocked(mazeData, r, c, z)) return { value: c + 1 + H, hit: true };
    }
  }
  return { value: pos.y, hit: false };
}

/**
 * 플레이어가 걸친 칸들 중 발 높이 이하인 지형의 최댓값 = 지금 서게 될 바닥.
 * 위(z 보다 높은 칸)는 애초에 들어갈 수 없으므로 바닥 후보가 아니다.
 */
function groundHeight(
  mazeData: MazeDataType,
  pos: Vec2,
  z: number,
): number {
  const H = PLAYER_HALF;
  let ground = 0;
  const rLo = Math.floor(pos.x - H + EPS);
  const rHi = Math.floor(pos.x + H - EPS);
  const cLo = Math.floor(pos.y - H + EPS);
  const cHi = Math.floor(pos.y + H - EPS);
  for (let r = rLo; r <= rHi; r++) {
    for (let c = cLo; c <= cHi; c++) {
      const h = heightAt(mazeData, r, c);
      if (h <= z + EPS && h > ground) ground = h;
    }
  }
  return ground;
}

/** 중력을 한 스텝 적용하고 지면에 착지시킨다. */
function applyGravity(
  z: number,
  vz: number,
  ground: number,
  dt: number,
): { z: number; vz: number; grounded: boolean } {
  let nz = z + (vz - GRAVITY * dt) * dt;
  let nvz = vz - GRAVITY * dt;
  if (nz <= ground) {
    nz = ground;
    nvz = 0;
    return { z: nz, vz: nvz, grounded: true };
  }
  return { z: nz, vz: nvz, grounded: false };
}

/** 도착 판정 — 수평으로 가깝고 end 셀과 같은 층에 있어야 한다. */
function isWin(state: Pick<GameState, 'pos' | 'z'>, maze: MazeLike): boolean {
  const endCenter = { x: maze.end.x + 0.5, y: maze.end.y + 0.5 };
  const flat = Math.hypot(
    state.pos.x - endCenter.x,
    state.pos.y - endCenter.y,
  );
  if (flat > WIN_DIST) return false;
  const endH = heightAt(maze.mazeData, maze.end.x, maze.end.y);
  return Math.abs(state.z - endH) <= WIN_Z_TOLERANCE;
}

/** 탑다운 한 스텝 — 2축 자유 이동 + 중력(낭떠러지에서는 떨어진다). */
function stepTop(
  state: GameState,
  maze: MazeLike,
  input: Input,
  dt: number,
  now: number,
): GameState {
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
  const rx = resolveAxis(maze.mazeData, pos, 'x', vx, state.z);
  pos.x = rx.value;
  if (rx.hit) vx = 0;

  pos.y += vy * dt;
  const ry = resolveAxis(maze.mazeData, pos, 'y', vy, state.z);
  pos.y = ry.value;
  if (ry.hit) vy = 0;

  // 높은 지대에서 낮은 칸으로 나가면 떨어진다 — 내려오는 길은 언제나 열려 있다.
  const ground = groundHeight(maze.mazeData, pos, state.z);
  const g = applyGravity(state.z, state.vz, ground, dt);

  const hasInput = inLen > 0.001;
  const startedAt = state.startedAt ?? (hasInput ? now : null);
  // 전환 축은 마지막으로 "의미 있게" 움직인 방향이 정한다.
  const lastMove =
    Math.abs(input.x) > Math.abs(input.y) + 0.001
      ? 'v'
      : Math.abs(input.y) > Math.abs(input.x) + 0.001
        ? 'h'
        : state.lastMove;

  const won = isWin({ pos, z: g.z }, maze);

  return {
    ...state,
    status: won ? 'won' : startedAt !== null ? 'playing' : 'ready',
    pos,
    vel: { x: vx, y: vy },
    z: g.z,
    vz: g.vz,
    grounded: g.grounded,
    lastMove,
    startedAt,
    finishedAt: won ? now : null,
  };
}

/** 사이드뷰 한 스텝 — 슬라이스 위 1축 이동 + 점프. 입력은 화면 기준이다. */
function stepSide(
  state: GameState,
  maze: MazeLike,
  input: Input,
  dt: number,
  now: number,
): GameState {
  const terrain = sliceTerrain(maze.mazeData, state.axis, state.fixed);
  const along = state.axis === 'col' ? state.pos.x : state.pos.y;

  const dir = Math.abs(input.y) > 0.001 ? Math.max(-1, Math.min(1, input.y)) : 0;
  const facing = dir !== 0 ? Math.sign(dir) : state.facing;

  // 가로 이동 — 진행 방향 칸의 지형이 발보다 높으면 막힌다.
  let next = along + dir * SIDE_SPEED * dt;
  if (dir !== 0) {
    const lead = Math.floor(next + Math.sign(dir) * PLAYER_HALF);
    const h =
      lead < 0 || lead >= terrain.length ? ABSOLUTE_WALL : terrain[lead];
    if (h > state.z + EPS) {
      // 벽면에 딱 붙여 세운다
      next = dir > 0 ? lead - PLAYER_HALF : lead + 1 + PLAYER_HALF;
    }
  }
  next = Math.max(PLAYER_HALF, Math.min(terrain.length - PLAYER_HALF, next));

  // 점프 — 화면 위 입력, 착지 상태에서만
  let vz = state.vz;
  const wantsJump = input.x < -0.5;
  if (wantsJump && state.grounded) vz = JUMP_V;

  // 발이 걸친 칸들 중 발 높이 이하인 지형의 최댓값이 지면 — 턱 가장자리에도 설 수 있다.
  let ground = 0;
  const lo = Math.floor(next - PLAYER_HALF + EPS);
  const hi = Math.floor(next + PLAYER_HALF - EPS);
  for (let i = lo; i <= hi; i++) {
    const h = i < 0 || i >= terrain.length ? ABSOLUTE_WALL : terrain[i];
    if (h <= state.z + EPS && h > ground) ground = h;
  }
  const g = applyGravity(state.z, vz, ground, dt);

  const pos: Vec2 =
    state.axis === 'col'
      ? { x: next, y: state.pos.y }
      : { x: state.pos.x, y: next };

  const hasInput = Math.abs(input.x) > 0.001 || Math.abs(input.y) > 0.001;
  const startedAt = state.startedAt ?? (hasInput ? now : null);
  const won = isWin({ pos, z: g.z }, maze);

  return {
    ...state,
    status: won ? 'won' : startedAt !== null ? 'playing' : 'ready',
    pos,
    vel: { x: 0, y: dir * SIDE_SPEED },
    z: g.z,
    vz: g.vz,
    grounded: g.grounded,
    facing,
    startedAt,
    finishedAt: won ? now : null,
  };
}

/**
 * 물리 한 스텝(dt초)을 전진시킨다. 현재 시점(mode)에 따라 탑다운/사이드뷰 물리를
 * 적용한다. 순수 함수 — 같은 입력에 항상 같은 결과를 준다.
 */
export function step(
  state: GameState,
  maze: MazeLike,
  input: Input,
  dt: number,
  now: number = Date.now(),
): GameState {
  if (state.status === 'won') return state;
  return state.mode === 'side'
    ? stepSide(state, maze, input, dt, now)
    : stepTop(state, maze, input, dt, now);
}

/** 지금 위치에서 그 축으로 전환하면 세워질 줄의 인덱스. */
export function sliceIndexFor(state: GameState, axis: SliceAxis): number {
  return axis === 'col' ? Math.floor(state.pos.y) : Math.floor(state.pos.x);
}

/**
 * 탑다운 → 사이드뷰. 어느 축으로 자를지는 호출자가 정한다 — 마지막 이동 방향으로
 * 자동 결정하면 플레이어가 자기 직전 입력을 기억해야 해서 예측이 어렵다.
 * axis 를 생략하면 예전처럼 마지막 이동 방향을 쓴다.
 * 고정 축 좌표는 칸 중심으로 정렬해 복귀 시 좌표가 어긋나지 않게 한다.
 */
export function enterSideView(
  state: GameState,
  axis: SliceAxis = state.lastMove === 'v' ? 'col' : 'row',
): GameState {
  if (state.mode === 'side') return state;
  const fixed = sliceIndexFor(state, axis);
  const pos: Vec2 =
    axis === 'col'
      ? { x: state.pos.x, y: fixed + 0.5 }
      : { x: fixed + 0.5, y: state.pos.y };
  return {
    ...state,
    mode: 'side',
    axis,
    fixed,
    pos,
    vel: { x: 0, y: 0 },
    vz: 0,
    facing: 1,
  };
}

/**
 * 사이드뷰 → 탑다운. 착지 상태에서만 가능하며, **높이 z 는 유지된다** —
 * 높은 지대에서 복귀하면 그 층을 탑다운으로 걸어다닐 수 있다(2층 통로).
 * 돌아갈 수 없는 상태면 null 을 돌려준다.
 */
export function exitSideView(state: GameState): GameState | null {
  if (state.mode === 'top') return state;
  if (!state.grounded) return null;
  const pos: Vec2 =
    state.axis === 'col'
      ? { x: Math.floor(state.pos.x) + 0.5, y: state.pos.y }
      : { x: state.pos.x, y: Math.floor(state.pos.y) + 0.5 };
  return {
    ...state,
    mode: 'top',
    pos,
    vel: { x: 0, y: 0 },
    vz: 0,
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
