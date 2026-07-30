import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const maker = style({
  position: 'relative',
  marginBottom: vars.space.lg,
  cursor: 'pointer',
});
