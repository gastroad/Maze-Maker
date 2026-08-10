// 캐릭터는 PNG 대신 코드로 그리는 픽셀 데이터다. 셀이 작아져도 뭉개지지 않고,
// 색이 팔레트 객체에 모여 있어 스킨 추가가 값 교체만으로 끝난다.
//
// 시점이 둘이므로 스프라이트도 두 벌이다 — 위에서 본 모습과 옆에서 본 모습은
// 물리적으로 다른 그림이라 하나를 회전해 쓸 수 없다.

/** 픽셀 문자 → 색. null 은 투명. */
export const SPRITE_PALETTE: Record<string, string | null> = {
  '.': null,
  k: '#0d0a05', // 아웃라인
  h: '#3d6b82', // 후드(그늘)
  H: '#4d87a3', // 후드(밝은 면)
  d: '#2b4d5e', // 후드 그림자
  s: '#f0c9a0', // 피부
  c: '#2f5568', // 망토/몸통
  l: '#8a6a3a', // 벨트·가죽
  f: '#ffb347', // 불꽃
  F: '#fff0a0', // 불꽃 심지
  e: '#141414', // 눈
};

export interface Sprite {
  rows: readonly string[];
  w: number;
  h: number;
}

function sprite(rows: readonly string[]): Sprite {
  return { rows, w: rows[0].length, h: rows.length };
}

/**
 * 탑다운 — 위에서 살짝 비스듬히 본 3/4 뷰.
 * 정수리만 그리면 사람으로 읽히지 않아 얼굴이 보이는 각도로 잡았다.
 */
export const SPR_TOP = sprite([
  '....kkkkk....',
  '..kkHHHHHkk..',
  '.kHHHHHHHHHk.',
  '.kHHhhhhhHHk.',
  'kHHhhhhhhhHHk',
  'kHhsssssssHhk',
  'kdhssesesshdk',
  'kcdhhhhhhhdck',
  'kccccccccck.f',
  '.kcccccccck.F',
  '..kcccccck..f',
  '...kkkkkkk...',
  '.............',
]);

// 사이드뷰 — 오른쪽을 바라본 옆모습. 왼쪽은 좌우 반전으로 재사용한다.
// 상체는 공통이고 아래 세 줄(다리)만 자세마다 갈린다.
const SIDE_UPPER = [
  '...kkkkk.....',
  '..kHHHHHk....',
  '.kHHHHHHHk...',
  '.kHssssssk...',
  '.kHsseskk....',
  '.kHsssssk....',
  '..kdsssk.....',
  '.kcccccck..f.',
  'kcccccccck.F.',
  'kccccccccklf.',
  'kcccccccckl..',
  '.kllllllk....',
];

/** 서 있는 자세 — 두 다리를 모은다. */
export const SPR_SIDE = sprite([
  ...SIDE_UPPER,
  '.kcck.kcck...',
  '.kcck.kcck...',
  '.kkkk.kkkk...',
  '.............',
]);

/** 걷기 — 다리를 벌린 프레임. 서 있는 자세와 번갈아 쓴다. */
const SPR_SIDE_STRIDE = sprite([
  ...SIDE_UPPER,
  'kcck...kcck..',
  'kcck...kcck..',
  'kkk.....kkk..',
  '.............',
]);

/** 점프·낙하 — 다리를 모아 접는다. */
export const SPR_SIDE_JUMP = sprite([
  ...SIDE_UPPER,
  '..kcckcck....',
  '..kcckcck....',
  '..kkkkkk.....',
  '.............',
]);

/** 걷기 사이클(두 프레임). */
export const SIDE_WALK_CYCLE = [SPR_SIDE, SPR_SIDE_STRIDE] as const;

/** 걷기 한 프레임이 유지되는 시간(ms). */
const WALK_FRAME_MS = 130;

/**
 * 지금 그릴 옆모습을 고른다.
 * 공중에 있으면 점프 자세, 움직이는 중이면 걷기 사이클, 멈춰 있으면 선 자세.
 */
export function sideFrame(
  speed: number,
  grounded: boolean,
  timeMs: number,
): Sprite {
  if (!grounded) return SPR_SIDE_JUMP;
  if (speed < 0.4) return SPR_SIDE;
  const i = Math.floor(timeMs / WALK_FRAME_MS) % SIDE_WALK_CYCLE.length;
  return SIDE_WALK_CYCLE[i];
}

/**
 * 탑다운은 위에서 보므로 다리가 보이지 않는다. 대신 걸을 때 상하로 살짝
 * 흔들어 움직이는 느낌을 준다(픽셀 단위라 정수로 끊는다).
 */
export function topBobPixels(speed: number, timeMs: number): number {
  if (speed < 0.4) return 0;
  return Math.sin(timeMs / 90) > 0 ? 1 : 0;
}

/**
 * 스프라이트를 (x, y)에 픽셀 크기 px 로 그린다.
 * flip 이면 좌우를 뒤집는다(왼쪽을 바라보는 경우).
 */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  spr: Sprite,
  x: number,
  y: number,
  px: number,
  flip = false,
): void {
  ctx.save();
  if (flip) {
    ctx.translate(x + spr.w * px, y);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(x, y);
  }
  for (let r = 0; r < spr.h; r++) {
    const row = spr.rows[r];
    for (let c = 0; c < row.length; c++) {
      const color = SPRITE_PALETTE[row[c]];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(c * px, r * px, px, px);
    }
  }
  ctx.restore();
}

/** 스프라이트가 target 픽셀 폭에 최대한 가깝게 보이는 정수 픽셀 크기. */
export function pixelSize(spr: Sprite, targetWidth: number): number {
  return Math.max(1, Math.round(targetWidth / spr.w));
}
