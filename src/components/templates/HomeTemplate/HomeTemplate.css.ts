import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const home = style({
  display: 'flex',
  flexFlow: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  padding: `${vars.space.xl} ${vars.space.lg}`,
});
