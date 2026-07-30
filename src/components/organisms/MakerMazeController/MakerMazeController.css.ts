import { style, globalStyle } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const controller = style({
  display: 'grid',
  gap: '0.6rem',
  marginTop: vars.space.lg,
  textAlign: 'center',
  position: 'fixed',
  right: '1.5rem',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '220px',
  '@media': {
    'screen and (max-width: 1116px)': {
      position: 'static',
      transform: 'none',
      width: 'auto',
      marginTop: vars.space.lg,
    },
  },
});

export const row = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '0.6rem',
});

globalStyle(`.${controller} button`, { width: '100%' });
