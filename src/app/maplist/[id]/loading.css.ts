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

export const board = style({
  width: '100%',
  maxWidth: '520px',
  margin: '0 auto',
  aspectRatio: '1',
});

export const deck = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.md,
});
