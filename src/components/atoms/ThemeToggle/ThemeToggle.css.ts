import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const toggle = style({
  position: 'absolute',
  top: vars.space.md,
  right: vars.space.md,
  zIndex: 50,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  borderRadius: vars.radius.pill,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface2,
  cursor: 'pointer',
  boxShadow: vars.shadow.sm,
  transition: `background ${vars.transition.base}, transform ${vars.transition.fast}, box-shadow ${vars.transition.base}`,
  selectors: {
    '&:hover': {
      background: vars.color.surface3,
      transform: 'translateY(-1px)',
      boxShadow: vars.shadow.glow,
    },
    '&:active': { transform: 'translateY(0)' },
    '&:focus-visible': { outline: 'none', boxShadow: vars.shadow.focus },
  },
});

export const icon = style({
  fontSize: '1.1rem',
  lineHeight: 1,
});
