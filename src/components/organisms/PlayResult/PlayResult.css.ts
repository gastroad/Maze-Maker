import { style, globalStyle, keyframes } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

const fade = keyframes({
  from: { opacity: 0, transform: 'scale(0.96)' },
  to: { opacity: 1, transform: 'scale(1)' },
});

export const result = style({
  position: 'absolute',
  inset: 0,
  zIndex: 5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: vars.space.md,
  background: vars.color.overlay,
  backdropFilter: 'blur(4px)',
  borderRadius: 'inherit',
  animation: `${fade} 0.22s ease`,
});

export const card = style({
  width: '100%',
  maxWidth: '300px',
  padding: '1.75rem 1.5rem',
  textAlign: 'center',
  background: vars.color.surface,
  border: `1px solid ${vars.color.borderStrong}`,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.lg,
});

export const title = style({
  fontSize: vars.fontSize.xl,
  fontWeight: vars.weight.bold,
  color: vars.color.text,
});

export const stars = style({
  margin: '0.85rem 0 1.1rem',
  fontSize: '2rem',
  letterSpacing: '0.15em',
});
globalStyle(`.${stars} span`, {
  color: vars.color.surface3,
  transition: `color ${vars.transition.base}`,
});
globalStyle(`.${stars} span.on`, {
  color: vars.color.primary,
  textShadow: `0 0 12px ${vars.color.glow}`,
});

export const stats = style({
  display: 'flex',
  justifyContent: 'center',
  gap: '1.5rem',
  marginBottom: vars.space.lg,
});
globalStyle(`.${stats} > div`, {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
});
globalStyle(`.${stats} dt`, {
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
});
globalStyle(`.${stats} dd`, {
  fontSize: vars.fontSize.lg,
  fontWeight: vars.weight.bold,
  color: vars.color.text,
  fontVariantNumeric: 'tabular-nums',
});
globalStyle(`.${stats} dd span`, {
  fontSize: vars.fontSize.xs,
  fontWeight: vars.weight.medium,
  color: vars.color.textFaint,
});

export const actions = style({ display: 'flex', gap: '0.6rem' });
globalStyle(`.${actions} > *`, { flex: 1 });
