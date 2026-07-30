import { style, keyframes } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

const spin = keyframes({
  to: { transform: 'rotate(360deg)' },
});

export const wrap = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.md,
  padding: `${vars.space.xl} 0`,
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
});

export const spinner = style({
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  border: `3px solid ${vars.color.border}`,
  borderTopColor: vars.color.primary,
  boxShadow: `0 0 14px -2px ${vars.color.glow}`,
  animation: `${spin} 0.8s linear infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animationDuration: '2.4s' },
  },
});
