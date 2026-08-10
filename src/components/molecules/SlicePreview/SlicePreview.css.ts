import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const wrap = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  width: '100%',
});

export const head = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
});

export const title = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontSize: vars.fontSize.xs,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.textMuted,
});

export const index = style({
  fontVariantNumeric: 'tabular-nums',
  color: vars.color.primary,
  fontWeight: vars.weight.semibold,
});

export const toggle = style({
  padding: `2px ${vars.space.sm}`,
  borderRadius: vars.radius.pill,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface2,
  color: vars.color.text,
  fontSize: vars.fontSize.xs,
  cursor: 'pointer',
  selectors: {
    '&:hover': { borderColor: vars.color.primary },
    '&:focus-visible': { outline: 'none', boxShadow: vars.shadow.focus },
  },
});

export const canvas = style({
  display: 'block',
  width: '100%',
  height: '110px',
  borderRadius: vars.radius.sm,
  border: `1px solid ${vars.color.border}`,
});

export const empty = style({
  margin: 0,
  padding: `${vars.space.md} ${vars.space.sm}`,
  borderRadius: vars.radius.sm,
  border: `1px dashed ${vars.color.border}`,
  color: vars.color.textFaint,
  fontSize: vars.fontSize.xs,
  lineHeight: 1.5,
  textAlign: 'center',
});
