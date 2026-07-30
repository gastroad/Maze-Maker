import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const button = style({
  position: 'absolute',
  top: vars.space.sm,
  right: vars.space.sm,
  padding: '4px 8px',
  fontSize: vars.fontSize.xs,
  color: '#fff',
  background: vars.color.danger,
  border: 'none',
  borderRadius: vars.radius.sm,
  cursor: 'pointer',
  zIndex: 1,
  transition: `background ${vars.transition.base}, opacity ${vars.transition.base}`,
  selectors: {
    '&:hover': { background: vars.color.dangerHover },
    '&:disabled': { opacity: 0.6, cursor: 'default' },
  },
});
