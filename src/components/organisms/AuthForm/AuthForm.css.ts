import { style, globalStyle } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  width: '100%',
  maxWidth: '360px',
  margin: `${vars.space.xl} auto 0`,
});

export const tabs = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space.sm,
  marginBottom: '6px',
});

export const error = style({
  color: vars.color.danger,
  fontSize: vars.fontSize.sm,
  textAlign: 'center',
  margin: 0,
});

globalStyle(`.${tabs} button`, { width: '100%' });
// 제출 버튼(직속 button)만 강조: 폼과 살짝 띄우고 넓게
globalStyle(`.${form} > button`, {
  width: '100%',
  marginTop: '4px',
  padding: '0.85rem',
});
