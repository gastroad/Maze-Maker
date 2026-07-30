import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const form = style({
  display: 'grid',
  gap: vars.space.md,
  marginBottom: vars.space.xl,
});

export const sizeRow = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: vars.space.md,
});
