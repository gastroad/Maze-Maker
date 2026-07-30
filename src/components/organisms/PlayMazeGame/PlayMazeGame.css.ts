import { style } from '@vanilla-extract/css';

export const wrap = style({
  display: 'flex',
  flexFlow: 'column',
});

export const game = style({
  position: 'relative',
  marginBottom: '1.25rem',
  touchAction: 'none',
});
