import { globalStyle } from '@vanilla-extract/css';
import { vars } from './theme.css';

// ── 리셋 (모던·경량) ─────────────────────────────────────────
globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
});

globalStyle('html', {
  height: '100%',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  textRendering: 'optimizeLegibility',
  background: vars.color.bg,
  colorScheme: 'dark light',
});

globalStyle('body', {
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.md,
  fontWeight: vars.weight.regular,
  lineHeight: 1.4,
  color: vars.color.text,
});

globalStyle('button, input, textarea, select', {
  font: 'inherit',
  color: 'inherit',
});

globalStyle('a', { color: 'inherit', textDecoration: 'none' });
globalStyle('ul, ol', { listStyle: 'none' });
globalStyle('img, svg, video', { display: 'block', maxWidth: '100%' });

// ── 앱 셸: 캐비닛을 감싸는 페이지 배경 (body#body) ──────────────
globalStyle('#body', {
  position: 'relative',
  minHeight: '100vh',
  padding: `${vars.space.lg} ${vars.space.md}`,
  // 상단에서 은은하게 번지는 횃불 광
  backgroundImage: `radial-gradient(120% 80% at 50% -10%, ${vars.color.glow}, transparent 55%)`,
  transition: `background ${vars.transition.base}`,
});

// ── 셀렉션 & 스크롤바 ────────────────────────────────────────
globalStyle('::selection', {
  background: vars.color.glow,
  color: vars.color.onPrimary,
});

globalStyle('::-webkit-scrollbar', { width: '10px', height: '10px' });
globalStyle('::-webkit-scrollbar-thumb', {
  background: vars.color.borderStrong,
  borderRadius: vars.radius.pill,
  border: `2px solid ${vars.color.surface}`,
});
globalStyle('::-webkit-scrollbar-track', { background: 'transparent' });
