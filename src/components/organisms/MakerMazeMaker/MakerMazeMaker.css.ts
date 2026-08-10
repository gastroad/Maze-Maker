import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const wrap = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  width: '100%',
  maxWidth: 'min(100%, 520px)',
  margin: '0 auto',
  justifySelf: 'stretch',
});

export const maker = style({
  position: 'relative',
  width: '100%',
  aspectRatio: '1 / 1',
});
