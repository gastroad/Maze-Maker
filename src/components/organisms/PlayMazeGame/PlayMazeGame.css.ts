import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

// 데스크톱: [보드] [사이드 덱] / 모바일: 세로 스택
export const wrap = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 240px',
  gap: vars.space.lg,
  alignItems: 'start',
  '@media': {
    'screen and (max-width: 760px)': { gridTemplateColumns: '1fr' },
  },
});

export const game = style({
  position: 'relative',
  width: '100%',
  maxWidth: 'min(100%, 520px)',
  margin: '0 auto',
  touchAction: 'none',
});

// 캔버스 내부 해상도는 게임 루프가 DPR 에 맞춰 잡는다. 여기서는 표시 크기만 정한다.
export const canvas = style({
  display: 'block',
  width: '100%',
  aspectRatio: '1 / 1',
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.road,
  boxShadow: vars.shadow.md,
  imageRendering: 'pixelated',
});

// 시작점이 보통 왼쪽 위라 HUD 를 그쪽에 두면 캐릭터를 가린다.
export const hud = style({
  position: 'absolute',
  top: vars.space.sm,
  right: vars.space.sm,
  display: 'flex',
  gap: vars.space.xs,
  pointerEvents: 'none',
});

export const badge = style({
  fontSize: vars.fontSize.xs,
  fontWeight: vars.weight.bold,
  letterSpacing: '0.1em',
  padding: `2px ${vars.space.sm}`,
  borderRadius: vars.radius.pill,
  background: vars.color.overlay,
  color: vars.color.primary,
  border: `1px solid ${vars.color.border}`,
  selectors: {
    '&[data-mode="side"]': { color: vars.color.accent },
  },
});

export const floor = style({
  fontSize: vars.fontSize.xs,
  fontWeight: vars.weight.semibold,
  padding: `2px ${vars.space.sm}`,
  borderRadius: vars.radius.pill,
  background: vars.color.overlay,
  color: vars.color.text,
  border: `1px solid ${vars.color.border}`,
});

export const notice = style({
  position: 'absolute',
  left: '50%',
  bottom: vars.space.md,
  transform: 'translateX(-50%)',
  margin: 0,
  padding: `${vars.space.xs} ${vars.space.md}`,
  borderRadius: vars.radius.pill,
  background: vars.color.overlay,
  border: `1px solid ${vars.color.borderStrong}`,
  color: vars.color.text,
  fontSize: vars.fontSize.xs,
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
});

export const deck = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.md,
});

export const hint = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textFaint,
  textAlign: 'center',
  lineHeight: 1.5,
});
