import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const status = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  minHeight: '40px',
});

export const user = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.md,
});

export const link = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: `${vars.space.sm} ${vars.space.md}`,
  background: 'transparent',
  border: `1px solid ${vars.color.borderStrong}`,
  borderRadius: vars.radius.pill,
  color: vars.color.textMuted,
  fontSize: vars.fontSize.md,
  fontWeight: vars.weight.medium,
  cursor: 'pointer',
  textDecoration: 'none',
  transition: `color ${vars.transition.base}, background ${vars.transition.base}, border-color ${vars.transition.base}`,
  selectors: {
    '&:hover': {
      color: vars.color.text,
      background: vars.color.surface2,
      borderColor: vars.color.primary,
    },
  },
});
