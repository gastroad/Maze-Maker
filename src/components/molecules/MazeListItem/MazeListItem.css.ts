import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const item = style({ position: 'relative' });

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  padding: vars.space.sm,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: 'inherit',
  textDecoration: 'none',
  transition: `border-color ${vars.transition.base}, transform ${vars.transition.fast}, box-shadow ${vars.transition.base}`,
  selectors: {
    '&:hover': {
      borderColor: vars.color.primary,
      transform: 'translateY(-2px)',
      boxShadow: vars.shadow.md,
    },
  },
});

export const thumb = style({
  borderRadius: vars.radius.sm,
  overflow: 'hidden',
  border: `1px solid ${vars.color.border}`,
});

export const title = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.weight.semibold,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const meta = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  fontVariantNumeric: 'tabular-nums',
});
