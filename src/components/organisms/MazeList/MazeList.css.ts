import { style, globalStyle } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const list = style({
  color: vars.color.text,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  overflow: 'hidden',
});

globalStyle(`.${list} > li`, {
  borderBottom: `1px solid ${vars.color.border}`,
});
globalStyle(`.${list} > li:last-child`, { borderBottom: 'none' });
