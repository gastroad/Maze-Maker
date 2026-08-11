import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const toggle = style({
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

/**
 * 아이콘은 React state 가 아니라 <html data-theme> 에서 CSS 로 갈라진다.
 * 서버는 사용자의 테마를 알 수 없어(localStorage/시스템 선호) 마크업으로 그리면
 * 라이트 사용자의 하이드레이션에서 반드시 어긋나기 때문이다.
 */
export const icon = style({
  fontSize: '1.1rem',
  lineHeight: 1,
  selectors: {
    '&::before': { content: '"☀️"' },
    'html[data-theme="light"] &::before': { content: '"🌙"' },
  },
});
