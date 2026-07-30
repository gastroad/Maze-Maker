import { recipe } from '@vanilla-extract/recipes';

import { vars } from '@styles/theme.css';

export const button = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${vars.space.sm} ${vars.space.md}`,
    fontFamily: vars.font.body,
    fontSize: vars.fontSize.md,
    fontWeight: vars.weight.semibold,
    lineHeight: 1,
    cursor: 'pointer',
    borderRadius: vars.radius.md,
    border: '1px solid transparent',
    userSelect: 'none',
    transition: `background ${vars.transition.base}, color ${vars.transition.base}, transform ${vars.transition.fast}, box-shadow ${vars.transition.base}, border-color ${vars.transition.base}`,
    selectors: {
      '&:focus-visible': { outline: 'none', boxShadow: vars.shadow.focus },
      '&:active': { transform: 'translateY(1px)' },
    },
  },
  variants: {
    variant: {
      primary: {
        color: vars.color.onPrimary,
        background: vars.color.primary,
        boxShadow: vars.shadow.sm,
        selectors: {
          '&:hover': {
            background: vars.color.primaryHover,
            boxShadow: vars.shadow.glow,
          },
          '&:active': { background: vars.color.primaryActive },
        },
      },
      secondary: {
        color: vars.color.textMuted,
        background: vars.color.surface2,
        borderColor: vars.color.border,
        selectors: {
          '&:hover': {
            color: vars.color.text,
            background: vars.color.surface3,
            borderColor: vars.color.borderStrong,
          },
        },
      },
      tertiary: {
        color: vars.color.textMuted,
        background: 'transparent',
        selectors: {
          '&:hover': { color: vars.color.text, background: vars.color.surface2 },
        },
      },
    },
    active: {
      true: {},
    },
  },
  compoundVariants: [
    {
      variants: { variant: 'primary', active: true },
      style: { background: vars.color.primaryActive },
    },
    {
      variants: { variant: 'secondary', active: true },
      style: {
        color: vars.color.onPrimary,
        background: vars.color.primary,
        borderColor: 'transparent',
        selectors: { '&:hover': { background: vars.color.primaryHover } },
      },
    },
    {
      variants: { variant: 'tertiary', active: true },
      style: { background: vars.color.surface3, color: vars.color.text },
    },
  ],
  defaultVariants: { variant: 'primary' },
});
