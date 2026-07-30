import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const input = style({
  appearance: 'none',
  outline: 'none',
  boxSizing: 'border-box',
  width: '100%',
  padding: `${vars.space.sm} ${vars.space.md}`,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.md,
  color: vars.color.text,
  background: vars.color.surface2,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  transition: `border-color ${vars.transition.base}, box-shadow ${vars.transition.base}, background ${vars.transition.base}`,
  selectors: {
    '&::placeholder': { color: vars.color.textFaint },
    '&:hover': { borderColor: vars.color.borderStrong },
    '&:focus': {
      borderColor: vars.color.primary,
      background: vars.color.surface,
      boxShadow: vars.shadow.focus,
    },
  },
});
