import { style, keyframes } from '@vanilla-extract/css';

import { vars } from './theme.css';

const shimmer = keyframes({
  '0%': { backgroundPosition: '-200% 0' },
  '100%': { backgroundPosition: '200% 0' },
});

// 콘텐츠 자리표시(shimmer). width/height/borderRadius 는 인라인으로 지정해 조합.
export const skeleton = style({
  borderRadius: vars.radius.md,
  background: `linear-gradient(90deg, ${vars.color.surface2} 25%, ${vars.color.surface3} 50%, ${vars.color.surface2} 75%)`,
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.3s ease-in-out infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});
