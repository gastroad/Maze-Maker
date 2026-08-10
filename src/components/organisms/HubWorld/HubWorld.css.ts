import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const wrap = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 240px',
  gap: vars.space.lg,
  alignItems: 'start',
  '@media': {
    'screen and (max-width: 760px)': { gridTemplateColumns: '1fr' },
  },
});

export const stage = style({
  position: 'relative',
  width: '100%',
  maxWidth: 'min(100%, 560px)',
  margin: '0 auto',
  touchAction: 'none',
});

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

export const entering = style({
  position: 'absolute',
  left: '50%',
  bottom: vars.space.md,
  transform: 'translateX(-50%)',
  margin: 0,
  padding: `${vars.space.xs} ${vars.space.md}`,
  borderRadius: vars.radius.pill,
  background: vars.color.overlay,
  border: `1px solid ${vars.color.primary}`,
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
