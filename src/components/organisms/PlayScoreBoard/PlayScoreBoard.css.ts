import { style, globalStyle } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const board = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
});

export const item = style({
  display: 'inline-flex',
  alignItems: 'baseline',
  gap: '0.4rem',
  padding: '0.4rem 0.85rem',
  background: vars.color.surface2,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.pill,
});

export const label = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
});

export const value = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.weight.bold,
  color: vars.color.text,
  fontVariantNumeric: 'tabular-nums',
});

export const starRow = style({
  fontSize: vars.fontSize.md,
  letterSpacing: '0.05em',
  lineHeight: 1,
});
globalStyle(`.${starRow} .on`, { color: vars.color.primary });
globalStyle(`.${starRow} .off`, { color: vars.color.borderStrong });
