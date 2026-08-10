import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

// 사이드덱이 240px 이라 가로로 두 개를 놓으면 라벨이 잘린다.
// 세로로 쌓으면 터치 타겟도 넉넉해진다.
export const wrap = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  width: '100%',
});

const base = style({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.borderStrong}`,
  background: vars.color.surface2,
  color: vars.color.text,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.weight.semibold,
  cursor: 'pointer',
  touchAction: 'manipulation',
  transition: `background ${vars.transition.fast}, border-color ${vars.transition.fast}, transform ${vars.transition.fast}`,
  selectors: {
    '&:hover': {
      background: vars.color.surface3,
      borderColor: vars.color.primary,
    },
    '&:active': { transform: 'translateY(1px)' },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: vars.shadow.focus,
    },
  },
});

export const button = base;

export const back = style([
  base,
  {
    background: vars.color.primary,
    borderColor: vars.color.primary,
    color: vars.color.onPrimary,
    selectors: {
      '&:hover': {
        background: vars.color.primaryHover,
        borderColor: vars.color.primaryHover,
      },
    },
  },
]);

export const icon = style({
  width: '24px',
  height: '24px',
  flexShrink: 0,
});

export const cellIdle = style({
  fill: vars.color.border,
});

// 강조된 칸이 사이드뷰에서 걸어 다닐 단면이다
export const cellActive = style({
  fill: vars.color.primary,
});

export const label = style({
  whiteSpace: 'nowrap',
});
