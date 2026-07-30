import { style, globalStyle } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

// 보드 옆 세로 툴 레일
export const controller = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

export const railLabel = style({
  fontSize: vars.fontSize.xs,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: vars.color.textMuted,
  marginBottom: vars.space.xs,
});

export const submit = style({
  marginTop: vars.space.sm,
});

globalStyle(`.${controller} button`, { width: '100%' });
