import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const wrap = style({
  display: 'flex',
  flexFlow: 'column',
  gap: vars.space.xs,
});

export const label = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.weight.semibold,
  letterSpacing: '0.02em',
  color: vars.color.textMuted,
});
