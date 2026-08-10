import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

const base = style({
  display: 'block',
  width: '100%',
  height: '100%',
  borderRadius: vars.radius.md,
  background: vars.color.road,
});

export const canvas = base;

export const editable = style([
  base,
  {
    cursor: 'crosshair',
    touchAction: 'none', // 드래그 페인팅 중 스크롤/줌이 끼어들지 않게
    border: `1px solid ${vars.color.border}`,
    boxShadow: vars.shadow.md,
  },
]);
