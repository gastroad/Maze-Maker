import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const wrap = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.md,
  padding: `${vars.space.xl} 0`,
  textAlign: 'center',
});

export const icon = style({
  fontSize: '2.5rem',
  lineHeight: 1,
  color: vars.color.danger,
});

export const msg = style({
  margin: 0,
  color: vars.color.textMuted,
  maxWidth: '32ch',
  lineHeight: 1.6,
});
