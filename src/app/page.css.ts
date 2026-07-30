import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { vars } from '@styles/theme.css';

export const attract = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.md,
  padding: `${vars.space.md} 0`,
});

export const tagline = style({
  marginTop: `-${vars.space.xs}`,
  marginBottom: vars.space.sm,
  fontSize: vars.fontSize.md,
  color: vars.color.textMuted,
  textAlign: 'center',
});

export const menu = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  width: '100%',
  maxWidth: '320px',
});

export const menuItem = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.md,
    padding: `${vars.space.md} ${vars.space.lg}`,
    borderRadius: vars.radius.md,
    border: `1px solid ${vars.color.border}`,
    background: vars.color.surface,
    color: vars.color.text,
    fontFamily: vars.font.display,
    fontWeight: vars.weight.bold,
    fontSize: vars.fontSize.lg,
    letterSpacing: '0.03em',
    textDecoration: 'none',
    transition: `background ${vars.transition.base}, border-color ${vars.transition.base}, transform ${vars.transition.fast}`,
    selectors: {
      '&:hover': {
        background: vars.color.surface3,
        borderColor: vars.color.primary,
        transform: 'translateX(3px)',
      },
    },
  },
  variants: {
    variant: {
      primary: {
        background: vars.color.primary,
        color: vars.color.onPrimary,
        borderColor: 'transparent',
        boxShadow: vars.shadow.glow,
        selectors: {
          '&:hover': {
            background: vars.color.primaryHover,
            transform: 'translateX(3px)',
          },
        },
      },
    },
  },
});

export const menuIcon = style({
  color: 'currentColor',
  opacity: 0.85,
  fontSize: '0.9em',
});

export const authWrap = style({
  marginTop: vars.space.md,
  display: 'flex',
  justifyContent: 'center',
});
