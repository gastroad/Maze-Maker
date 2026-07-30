import { style, globalStyle } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const controller = style({
  display: 'flex',
  gap: vars.space.md,
  width: '100%',
  padding: `${vars.space.lg} 0`,
});

globalStyle(`.${controller} button`, { flex: 1 });
