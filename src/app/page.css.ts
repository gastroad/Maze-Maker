import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { vars } from '@styles/theme.css';

export const hero = style({
  textAlign: 'center',
  marginBottom: '2.75rem',
});

export const tagline = style({
  marginTop: vars.space.sm,
  fontSize: vars.fontSize.md,
  lineHeight: 1.5,
  color: vars.color.textMuted,
  letterSpacing: '0.01em',
});

export const actions = style({
  display: 'flex',
  flexFlow: 'column',
  alignItems: 'center',
  gap: vars.space.sm,
  width: '100%',
});

export const authWrap = style({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '1.9rem',
  width: '100%',
});

export const linkButton = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'min(100% - 3rem, 320px)',
    padding: `0.95rem ${vars.space.md}`,
    fontSize: vars.fontSize.lg,
    fontWeight: vars.weight.semibold,
    letterSpacing: '0.02em',
    textAlign: 'center',
    textDecoration: 'none',
    borderRadius: vars.radius.md,
    border: '1px solid transparent',
    transition: `background ${vars.transition.base}, transform ${vars.transition.fast}, box-shadow ${vars.transition.base}, border-color ${vars.transition.base}`,
  },
  variants: {
    variant: {
      primary: {
        color: vars.color.onPrimary,
        background: vars.color.primary,
        boxShadow: vars.shadow.md,
        selectors: {
          '&:hover': {
            background: vars.color.primaryHover,
            transform: 'translateY(-2px)',
            boxShadow: vars.shadow.lg,
          },
          '&:active': {
            background: vars.color.primaryActive,
            transform: 'translateY(0)',
          },
        },
      },
      secondary: {
        color: vars.color.text,
        background: 'transparent',
        borderColor: vars.color.borderStrong,
        selectors: {
          '&:hover': {
            background: vars.color.surface2,
            borderColor: vars.color.primary,
          },
          '&:active': { background: vars.color.surface3 },
        },
      },
    },
  },
  defaultVariants: { variant: 'primary' },
});
