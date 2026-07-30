import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const nav = style({
  display: 'flex',
  alignItems: 'center',
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderBottom: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
});
