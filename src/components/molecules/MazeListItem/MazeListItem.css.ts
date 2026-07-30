import { style, globalStyle } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const item = style({
  position: 'relative',
  color: vars.color.text,
});

export const link = style({
  display: 'block',
  padding: `${vars.space.md} ${vars.space.md}`,
  color: 'inherit',
  textDecoration: 'none',
  transition: `background ${vars.transition.base}`,
  selectors: {
    '&:hover': { background: vars.color.surface2 },
    '&:active': { background: vars.color.surface3 },
  },
});

export const title = style({
  textAlign: 'left',
  fontSize: vars.fontSize.lg,
  fontWeight: vars.weight.semibold,
  marginBottom: vars.space.xs,
});

export const info = style({
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  alignItems: 'center',
  fontSize: vars.fontSize.sm,
});

globalStyle(`.${info} > :nth-child(1)`, {
  textAlign: 'left',
  color: vars.color.textMuted,
});

globalStyle(`.${info} > :nth-child(2)`, {
  justifySelf: 'end',
  padding: '0.15rem 0.55rem',
  color: vars.color.textMuted,
  fontSize: vars.fontSize.xs,
  fontVariantNumeric: 'tabular-nums',
  background: vars.color.surface2,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.pill,
});
