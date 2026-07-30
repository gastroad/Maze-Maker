import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const board = style({
  display: 'grid',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  background: vars.color.road,
  boxShadow: vars.shadow.md,
  overflow: 'hidden',
});

export const col = style({
  display: 'grid',
});
