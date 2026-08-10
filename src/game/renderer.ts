import { vars } from '@styles/theme.css';
import { ABSOLUTE_WALL, type MazeDataType, type PointType } from '@type/maze';

import {
  sliceTerrain,
  heightAt,
  JUMP_MAX_HEIGHT,
  PLAYER_HALF,
  type GameState,
  type MazeLike,
} from './mazeEngine';
import { SPR_SIDE, SPR_TOP, drawSprite, pixelSize } from './sprites';

// 셀 하나당 DOM 노드를 만들면 100x100 에서 10,000 개가 되어 버틸 수 없다.
// 여기서는 캔버스에 그리되 카메라가 보는 범위만 그린다(뷰포트 컬링).
// 화면에 20x20 만 들어오면 미로가 아무리 커도 그리는 칸 수는 그대로다.

export interface Palette {
  road: string; // 내가 서 있는 층 = 걸을 수 있는 바닥
  pit: string; // 화면 바깥 여백
  wall: string; // 내 발보다 높은 칸 = 막힘
  wallTop: string;
  ledgeTop: string;
  cliff: string; // 낭떠러지의 절벽면 — 층 경계를 눈에 띄게 한다
  grid: string;
  goal: string;
  resolve: string;
  sky: string;
  ground: string;
  guide: string;
  text: string;
}

export interface RenderOptions {
  /**
   * 정답 경로를 `"행,열"` 키 집합으로 받는다. 셀마다 배열을 훑으면
   * 100x100 에서 렌더 한 번에 수백만 번 비교가 되므로 조회는 O(1)이어야 한다.
   */
  pathSet?: ReadonlySet<string>;
}

export interface ViewMetrics {
  width: number; // 캔버스 내부 픽셀 폭
  height: number;
  cell: number; // 셀 한 변(px)
}

export interface Camera {
  x: number; // 화면 중심이 보는 행 좌표
  y: number; // 화면 중심이 보는 열 좌표
}

const EPS = 1e-6;
/** 사이드뷰 화면에 담을 높이 범위(셀). 점프 여유가 보이도록 잡는다. */
const SIDE_Z_SPAN = 4.4;

function clamp(v: number, lo: number, hi: number): number {
  return lo > hi ? (lo + hi) / 2 : Math.max(lo, Math.min(hi, v));
}

/** vanilla-extract 토큰(`var(--x)`)의 실제 색을 읽는다 — 테마 전환이 그대로 반영된다. */
export function readPalette(el: HTMLElement): Palette {
  const cs = getComputedStyle(el);
  const v = (token: string, fallback: string): string => {
    const name = token.startsWith('var(') ? token.slice(4, -1) : token;
    return cs.getPropertyValue(name).trim() || fallback;
  };
  return {
    road: v(vars.color.road, '#14110b'),
    pit: v(vars.color.bg, '#0b0906'),
    wall: v(vars.color.wall, '#3a3020'),
    wallTop: v(vars.color.borderStrong, '#52472f'),
    ledgeTop: v(vars.color.primary, '#e08a2b'),
    cliff: v(vars.color.borderStrong, '#52472f'),
    grid: v(vars.color.gridLine, 'rgba(255,200,120,0.05)'),
    goal: v(vars.color.success, '#8ab34a'),
    resolve: v(vars.color.resolve, 'rgba(224,138,43,0.28)'),
    sky: v(vars.color.bg, '#12100c'),
    // 지면은 흙의 단면이다. surface 계열을 쓰면 라이트 테마에서 하늘과
    // 거의 같은 밝기가 되어 지형이 보이지 않는다.
    ground: v(vars.color.wall, '#3a3020'),
    guide: v(vars.color.primary, '#e08a2b'),
    text: v(vars.color.textMuted, '#b3a488'),
  };
}

/**
 * 플레이어를 따라가되 맵 경계를 넘어가지 않는 카메라.
 * 맵이 화면보다 작으면 가운데 고정한다.
 */
export function computeCamera(
  state: GameState,
  maze: MazeLike,
  m: ViewMetrics,
): Camera {
  const rows = maze.mazeData.length;
  const cols = maze.mazeData[0].length;
  const halfR = m.height / m.cell / 2;
  const halfC = m.width / m.cell / 2;
  return {
    x: clamp(state.pos.x, halfR, rows - halfR),
    y: clamp(state.pos.y, halfC, cols - halfC),
  };
}

/**
 * 아래층을 덮는 그늘의 진하기. 깊을수록 어둡다.
 * 색 토큰만으로 층을 구분하려 하면 road 와 bg 가 거의 같은 밝기라
 * (다크에서 #14110b vs #12100c) 1층과 2층이 분간되지 않는다.
 */
function depthShade(depth: number): string {
  return `rgba(0,0,0,${Math.min(0.68, 0.3 + Math.min(depth, 4) * 0.13)})`;
}

/** 탑다운 — 카메라가 보는 범위의 칸만 그린다. */
export function drawTopDown(
  ctx: CanvasRenderingContext2D,
  maze: MazeLike,
  state: GameState,
  cam: Camera,
  m: ViewMetrics,
  pal: Palette,
  opts: RenderOptions = {},
): void {
  const { width: W, height: H, cell } = m;
  const rows = maze.mazeData.length;
  const cols = maze.mazeData[0].length;

  ctx.fillStyle = pal.pit;
  ctx.fillRect(0, 0, W, H);

  const originX = W / 2 - cam.y * cell; // 열 → 화면 x
  const originY = H / 2 - cam.x * cell; // 행 → 화면 y
  const elevated = state.z > EPS; // 1층에서는 낭떠러지가 없어 강조가 필요 없다

  // 화면에 걸치는 칸 범위(양옆 한 칸 여유)
  const c0 = Math.max(0, Math.floor(cam.y - W / cell / 2) - 1);
  const c1 = Math.min(cols - 1, Math.ceil(cam.y + W / cell / 2) + 1);
  const r0 = Math.max(0, Math.floor(cam.x - H / cell / 2) - 1);
  const r1 = Math.min(rows - 1, Math.ceil(cam.x + H / cell / 2) + 1);

  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {
      const h = maze.mazeData[r][c];
      const d = h - state.z; // 내 발 기준 상대 높이
      const sx = originX + c * cell;
      const sy = originY + r * cell;

      if (d > EPS) {
        // 내 발보다 높은 칸 = 막힘. 한 번에 오를 수 있는 턱은 다른 색으로 알린다.
        ctx.fillStyle = pal.wall;
        ctx.fillRect(sx, sy, cell + 1, cell + 1);
        ctx.fillStyle = d <= JUMP_MAX_HEIGHT ? pal.ledgeTop : pal.wallTop;
        ctx.fillRect(sx, sy, cell + 1, Math.max(2, cell * 0.16));
        continue;
      }

      // 내 층이거나 아래층 — 바탕은 같고, 위아래로 명도를 벌린다.
      ctx.fillStyle = pal.road;
      ctx.fillRect(sx, sy, cell + 1, cell + 1);

      if (d < -EPS) {
        ctx.fillStyle = depthShade(-d);
        ctx.fillRect(sx, sy, cell + 1, cell + 1);
        // 위쪽 이웃이 더 높으면 그 경계가 절벽면이다. 이 선 하나가
        // "여기서 떨어진다"를 알려 준다.
        if (heightAt(maze.mazeData, r - 1, c) > h + EPS) {
          ctx.fillStyle = pal.cliff;
          ctx.fillRect(sx, sy, cell + 1, Math.max(2, cell * 0.11));
        }
      } else if (elevated) {
        // 2층 이상에서는 내 층을 들어올려 아래층과 갈라 놓는다.
        // 아래를 어둡게 하는 것만으로는 부족하다 — 다크 테마의 road 는
        // 이미 배경과 같은 밝기라 더 내려갈 여지가 없다.
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(sx, sy, cell + 1, cell + 1);
      }

      if (opts.pathSet?.has(`${r},${c}`)) {
        ctx.fillStyle = pal.resolve;
        ctx.fillRect(sx, sy, cell + 1, cell + 1);
      }
    }
  }

  // 격자
  ctx.strokeStyle = pal.grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let c = c0; c <= c1 + 1; c++) {
    const sx = Math.round(originX + c * cell) + 0.5;
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx, H);
  }
  for (let r = r0; r <= r1 + 1; r++) {
    const sy = Math.round(originY + r * cell) + 0.5;
    ctx.moveTo(0, sy);
    ctx.lineTo(W, sy);
  }
  ctx.stroke();

  // 도착점
  const gx = originX + (maze.end.y + 0.5) * cell;
  const gy = originY + (maze.end.x + 0.5) * cell;
  if (gx > -cell && gx < W + cell && gy > -cell && gy < H + cell) {
    ctx.fillStyle = pal.goal;
    ctx.beginPath();
    ctx.arc(gx, gy, cell * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.arc(gx, gy, cell * 0.46, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // 플레이어
  const px = originX + state.pos.y * cell;
  const py = originY + state.pos.x * cell;
  const ground = Math.min(
    state.z,
    heightAt(maze.mazeData, Math.floor(state.pos.x), Math.floor(state.pos.y)),
  );
  const air = state.z - ground;

  // 공중에 있으면 발밑에 그림자를 남겨 높이를 읽게 한다
  if (air > 0.02) {
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.ellipse(
      px,
      py + cell * 0.1,
      cell * 0.26,
      cell * 0.14,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  const size = pixelSize(SPR_TOP, cell * 0.78);
  const sw = SPR_TOP.w * size;
  const sh = SPR_TOP.h * size;
  const lift = air * cell * 0.5; // 높이 있으면 살짝 띄워 보인다
  drawSprite(ctx, SPR_TOP, px - sw / 2, py - sh / 2 - lift, size);

  drawTorchGlow(ctx, px, py - lift, cell * 2.4);
}

/** 사이드뷰 — 슬라이스 한 줄을 세워서 그린다. 가로도 카메라가 따라간다. */
export function drawSideView(
  ctx: CanvasRenderingContext2D,
  maze: MazeLike,
  state: GameState,
  m: ViewMetrics,
  pal: Palette,
): void {
  const { width: W, height: H } = m;
  const terrain = sliceTerrain(maze.mazeData, state.axis, state.fixed);
  const along = state.axis === 'col' ? state.pos.x : state.pos.y;

  const cw = m.cell;
  const chZ = H / SIDE_Z_SPAN; // 높이 1칸의 화면 높이
  const baseY = H - chZ * 0.55; // 높이 0 의 화면 Y
  const camAlong = clamp(along, W / cw / 2, terrain.length - W / cw / 2);
  const originX = W / 2 - camAlong * cw;

  ctx.fillStyle = pal.sky;
  ctx.fillRect(0, 0, W, H);

  // 지면 — 높이 0 인 칸도 바닥은 있다. 이걸 빼면 구멍처럼 보인다.
  ctx.fillStyle = pal.ground;
  ctx.fillRect(0, baseY, W, H - baseY);

  const i0 = Math.max(0, Math.floor(camAlong - W / cw / 2) - 1);
  const i1 = Math.min(terrain.length - 1, Math.ceil(camAlong + W / cw / 2) + 1);

  // 인접 슬라이스의 윗면만 점선으로 — 옆줄에 지형이 있다는 단서.
  // 면으로 채우면 주 지형을 압도해서 어느 쪽이 실제 바닥인지 읽을 수 없다.
  const neighbours = neighbourSlices(maze, state);
  ctx.save();
  ctx.strokeStyle = pal.guide;
  ctx.globalAlpha = 0.22;
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  for (const t of neighbours) {
    for (let i = i0; i <= i1; i++) {
      if (t[i] <= 0) continue;
      const y = baseY - Math.min(t[i], SIDE_Z_SPAN) * chZ;
      ctx.beginPath();
      ctx.moveTo(originX + i * cw + 3, y);
      ctx.lineTo(originX + (i + 1) * cw - 3, y);
      ctx.stroke();
    }
  }
  ctx.restore();

  // 지형 기둥
  for (let i = i0; i <= i1; i++) {
    const h = terrain[i];
    if (h <= 0) continue;
    const drawH = Math.min(h, SIDE_Z_SPAN + 1);
    const top = baseY - drawH * chZ;
    const sx = originX + i * cw;
    // 기둥 본체는 언제나 흙 단면이다. 넘을 수 있는지는 윗면 색으로 구분한다 —
    // 본체를 road 로 칠하면 라이트 테마에서 하늘과 같은 밝기가 된다.
    ctx.fillStyle = pal.ground;
    ctx.fillRect(sx, top, cw + 1, H - top);
    ctx.fillStyle =
      h - state.z <= JUMP_MAX_HEIGHT ? pal.ledgeTop : pal.wallTop;
    ctx.fillRect(sx, top, cw + 1, Math.max(3, chZ * 0.07));
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.fillRect(sx, top, 1, H - top);
  }

  // 바닥선
  ctx.strokeStyle = pal.grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, baseY + 0.5);
  ctx.lineTo(W, baseY + 0.5);
  ctx.stroke();

  // 점프 도달 높이 가이드 — 어디까지 오를 수 있는지 눈으로 보여준다
  const guideY = baseY - (state.z + JUMP_MAX_HEIGHT) * chZ;
  if (guideY > 0) {
    ctx.save();
    ctx.strokeStyle = pal.guide;
    ctx.globalAlpha = 0.35;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(0, guideY);
    ctx.lineTo(W, guideY);
    ctx.stroke();
    ctx.restore();
  }

  // 도착점이 이 단면에 있으면 표시
  const goalAlong =
    state.axis === 'col'
      ? state.fixed === maze.end.y
        ? maze.end.x
        : -1
      : state.fixed === maze.end.x
        ? maze.end.y
        : -1;
  if (goalAlong >= 0) {
    const gh = heightAt(maze.mazeData, maze.end.x, maze.end.y);
    ctx.fillStyle = pal.goal;
    ctx.beginPath();
    ctx.arc(
      originX + (goalAlong + 0.5) * cw,
      baseY - gh * chZ - cw * 0.3,
      cw * 0.26,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  // 플레이어
  const size = pixelSize(SPR_SIDE, cw * 0.72);
  const sw = SPR_SIDE.w * size;
  const sh = SPR_SIDE.h * size;
  const px = originX + along * cw;
  const py = baseY - state.z * chZ;
  drawSprite(ctx, SPR_SIDE, px - sw / 2, py - sh, size, state.facing < 0);

  drawTorchGlow(ctx, px, py - sh / 2, cw * 3);
}

// ── 정적 렌더(편집기·썸네일) ─────────────────────────────────
// 플레이 화면은 "플레이어와의 높이 관계"로 칸을 칠하지만, 편집기와 썸네일에는
// 플레이어가 없으므로 절대 높이를 그대로 보여준다.

export interface StaticMazeView {
  mazeData: MazeDataType;
  start: PointType;
  end: PointType;
}

export interface StaticRenderOptions {
  hover?: { row: number; col: number } | null;
  /** 셀이 이만큼 크면 높이 숫자를 겹쳐 그린다(편집 중 값 확인용). */
  showValues?: boolean;
  pathSet?: ReadonlySet<string>;
}

/** 미로 전체가 화면에 들어가도록 셀 크기를 맞춘다. */
export function fitMetrics(
  mazeData: MazeDataType,
  width: number,
  height: number,
): ViewMetrics {
  const rows = mazeData.length;
  const cols = mazeData[0]?.length ?? 1;
  return {
    width,
    height,
    cell: Math.min(width / cols, height / rows),
  };
}

/** 절대 높이에 따른 칸 색. 높을수록 짙어진다. */
function heightShade(h: number): string {
  return `rgba(0,0,0,${Math.min(0.55, (h - 1) * 0.13)})`;
}

export function drawStaticMaze(
  ctx: CanvasRenderingContext2D,
  view: StaticMazeView,
  m: ViewMetrics,
  pal: Palette,
  opts: StaticRenderOptions = {},
): void {
  const { width: W, height: H, cell } = m;
  const rows = view.mazeData.length;
  const cols = view.mazeData[0].length;
  const originX = (W - cols * cell) / 2;
  const originY = (H - rows * cell) / 2;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = pal.road;
  ctx.fillRect(originX, originY, cols * cell, rows * cell);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const h = view.mazeData[r][c];
      const sx = originX + c * cell;
      const sy = originY + r * cell;

      if (h > 0) {
        ctx.fillStyle = pal.wall;
        ctx.fillRect(sx, sy, cell + 0.5, cell + 0.5);
        if (h > 1) {
          ctx.fillStyle = heightShade(h);
          ctx.fillRect(sx, sy, cell + 0.5, cell + 0.5);
        }
        // 윗면 — 한 번에 오를 수 있는 턱만 다른 색으로 알린다
        ctx.fillStyle =
          h <= JUMP_MAX_HEIGHT
            ? pal.ledgeTop
            : h >= ABSOLUTE_WALL
              ? pal.cliff
              : pal.wallTop;
        ctx.fillRect(sx, sy, cell + 0.5, Math.max(1, cell * 0.16));
      } else if (opts.pathSet?.has(`${r},${c}`)) {
        ctx.fillStyle = pal.resolve;
        ctx.fillRect(sx, sy, cell + 0.5, cell + 0.5);
      }
    }
  }

  // 격자 — 셀이 너무 작으면 오히려 지저분해진다
  if (cell >= 6) {
    ctx.strokeStyle = pal.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let c = 0; c <= cols; c++) {
      const x = Math.round(originX + c * cell) + 0.5;
      ctx.moveTo(x, originY);
      ctx.lineTo(x, originY + rows * cell);
    }
    for (let r = 0; r <= rows; r++) {
      const y = Math.round(originY + r * cell) + 0.5;
      ctx.moveTo(originX, y);
      ctx.lineTo(originX + cols * cell, y);
    }
    ctx.stroke();
  }

  // 높이 값 — 편집 중에는 색보다 숫자가 정확하다
  if (opts.showValues && cell >= 18) {
    ctx.save();
    ctx.font = `${Math.round(cell * 0.4)}px ui-monospace, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = pal.text;
    ctx.globalAlpha = 0.65;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const h = view.mazeData[r][c];
        if (h === 0) continue;
        ctx.fillText(
          String(h),
          originX + (c + 0.5) * cell,
          originY + (r + 0.6) * cell,
        );
      }
    }
    ctx.restore();
  }

  // 도착점
  const gx = originX + (view.end.y + 0.5) * cell;
  const gy = originY + (view.end.x + 0.5) * cell;
  ctx.fillStyle = pal.goal;
  ctx.beginPath();
  ctx.arc(gx, gy, Math.max(2, cell * 0.3), 0, Math.PI * 2);
  ctx.fill();

  // 시작점 — 캐릭터를 그대로 세워 두면 어느 쪽이 출발인지 헷갈리지 않는다
  const px = pixelSize(SPR_TOP, cell * 0.9);
  const sw = SPR_TOP.w * px;
  const sh = SPR_TOP.h * px;
  drawSprite(
    ctx,
    SPR_TOP,
    originX + (view.start.y + 0.5) * cell - sw / 2,
    originY + (view.start.x + 0.5) * cell - sh / 2,
    px,
  );

  // 마우스가 가리키는 칸
  if (opts.hover) {
    const { row, col } = opts.hover;
    if (row >= 0 && col >= 0 && row < rows && col < cols) {
      ctx.strokeStyle = pal.ledgeTop;
      ctx.lineWidth = 2;
      ctx.strokeRect(
        originX + col * cell + 1,
        originY + row * cell + 1,
        cell - 2,
        cell - 2,
      );
    }
  }
}

/** 캔버스 좌표를 셀 좌표로 되돌린다(편집기 클릭 처리용). */
export function cellAt(
  mazeData: MazeDataType,
  m: ViewMetrics,
  x: number,
  y: number,
): { row: number; col: number } | null {
  const rows = mazeData.length;
  const cols = mazeData[0].length;
  const originX = (m.width - cols * m.cell) / 2;
  const originY = (m.height - rows * m.cell) / 2;
  const col = Math.floor((x - originX) / m.cell);
  const row = Math.floor((y - originY) / m.cell);
  if (row < 0 || col < 0 || row >= rows || col >= cols) return null;
  return { row, col };
}

function neighbourSlices(maze: MazeLike, state: GameState): number[][] {
  const limit =
    state.axis === 'col' ? maze.mazeData[0].length : maze.mazeData.length;
  return [state.fixed - 1, state.fixed + 1]
    .filter((i) => i >= 0 && i < limit)
    .map((i) => sliceTerrain(maze.mazeData, state.axis, i));
}

/** 횃불 발광 — 던전 분위기이자 플레이어 위치를 눈에 잡아 두는 장치. */
function drawTorchGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
): void {
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
  g.addColorStop(0, 'rgba(255,150,50,0.16)');
  g.addColorStop(1, 'rgba(255,150,50,0)');
  ctx.fillStyle = g;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

/** 현재 시점에 맞는 한 프레임을 그린다. */
export function render(
  ctx: CanvasRenderingContext2D,
  maze: MazeLike,
  state: GameState,
  m: ViewMetrics,
  pal: Palette,
  opts: RenderOptions = {},
): void {
  if (state.mode === 'side') {
    drawSideView(ctx, maze, state, m, pal);
    return;
  }
  drawTopDown(ctx, maze, state, computeCamera(state, maze, m), m, pal, opts);
}

export { PLAYER_HALF };
