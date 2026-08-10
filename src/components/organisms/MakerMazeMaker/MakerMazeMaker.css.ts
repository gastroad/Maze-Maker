import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const maker = style({
  position: 'relative',
  width: '100%',
  maxWidth: 'min(100%, 520px)',
  aspectRatio: '1 / 1',
  margin: '0 auto',
  justifySelf: 'stretch',
});
