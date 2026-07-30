import { style, globalStyle } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { vars } from '@styles/theme.css';

// 아케이드 캐비닛 프레임 (반응형: narrow=홈/로그인, wide=플레이/메이커/리스트)
export const frame = recipe({
  base: {
    position: 'relative',
    margin: '0 auto',
    background: `linear-gradient(155deg, ${vars.color.surface3}, ${vars.color.surface})`,
    border: `1px solid ${vars.color.borderStrong}`,
    borderRadius: vars.radius.lg,
    padding: vars.space.sm,
    boxShadow: `${vars.shadow.lg}, inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
    selectors: {
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: '6px',
        borderRadius: vars.radius.md,
        border: `1px solid ${vars.color.primary}`,
        opacity: 0.35,
        boxShadow: `0 0 24px -6px ${vars.color.glow}`,
        pointerEvents: 'none',
      },
    },
  },
  variants: {
    wide: {
      true: { maxWidth: '1000px' },
      false: { maxWidth: '480px' },
    },
  },
  defaultVariants: { wide: false },
});

export const marquee = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
  padding: `${vars.space.sm} ${vars.space.md}`,
  marginBottom: vars.space.sm,
  borderRadius: vars.radius.md,
  background: vars.color.surface2,
  border: `1px solid ${vars.color.border}`,
});

export const side = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.sm,
});

export const brand = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.sm,
  fontFamily: vars.font.display,
  fontWeight: vars.weight.bold,
  fontSize: vars.fontSize.lg,
  letterSpacing: '0.01em',
  color: vars.color.text,
});
globalStyle(`.${brand} .bolt`, { color: vars.color.primary });

export const backBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  borderRadius: vars.radius.pill,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: vars.color.textMuted,
  fontSize: '1.2rem',
  lineHeight: 1,
  textDecoration: 'none',
  transition: `background ${vars.transition.base}, color ${vars.transition.base}, border-color ${vars.transition.base}`,
  selectors: {
    '&:hover': {
      background: vars.color.surface3,
      color: vars.color.text,
      borderColor: vars.color.primary,
    },
  },
});

export const screen = style({
  position: 'relative',
  background: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: vars.space.lg,
  overflow: 'hidden',
});

export const screenLabel = style({
  textAlign: 'center',
  fontSize: vars.fontSize.xs,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: vars.color.primary,
  fontWeight: vars.weight.bold,
  marginBottom: vars.space.md,
});
