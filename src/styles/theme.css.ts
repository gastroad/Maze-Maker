import { createThemeContract, createTheme } from '@vanilla-extract/css';

/**
 * 디자인 시스템 토큰 계약. 모든 컴포넌트는 이 `vars`만 참조하고,
 * 실제 값은 라이트/다크 테마 클래스가 주입한다(<html>에 클래스 부여).
 */
export const vars = createThemeContract({
  color: {
    bg: null, // 카드 뒤 페이지 배경
    surface: null, // 앱 카드
    surface2: null, // 입력/리스트 행
    surface3: null, // hover/elevated
    border: null,
    borderStrong: null,
    text: null,
    textMuted: null,
    textFaint: null,
    primary: null,
    primaryHover: null,
    primaryActive: null,
    onPrimary: null,
    accent: null, // 아케이드 네온 보조색
    accentHover: null,
    success: null,
    danger: null,
    dangerHover: null,
    // 미로 보드
    wall: null,
    road: null,
    resolve: null,
    gridLine: null,
    // 이펙트
    glow: null,
    overlay: null,
  },
  space: { xs: null, sm: null, md: null, lg: null, xl: null, xxl: null },
  radius: { sm: null, md: null, lg: null, pill: null },
  fontSize: {
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
    xxl: null,
    xxxl: null,
  },
  font: { body: null, display: null },
  weight: { regular: null, medium: null, semibold: null, bold: null },
  shadow: { sm: null, md: null, lg: null, focus: null, glow: null },
  transition: { fast: null, base: null },
});

// 테마 간 변하지 않는 스케일(간격/모서리/타이포/모션)
const scale = {
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '40px',
    xxl: '64px',
  },
  radius: { sm: '8px', md: '12px', lg: '20px', pill: '999px' },
  fontSize: {
    xs: '0.75rem',
    sm: '0.85rem',
    md: '0.95rem',
    lg: '1.1rem',
    xl: '1.4rem',
    xxl: '1.8rem',
    xxxl: '2.4rem',
  },
  font: {
    body: "'Noto Sans KR', system-ui, sans-serif",
    display: "'Jua', 'Noto Sans KR', system-ui, sans-serif",
  },
  weight: { regular: '400', medium: '500', semibold: '600', bold: '700' },
  transition: { fast: '0.12s ease', base: '0.2s cubic-bezier(0.22, 1, 0.36, 1)' },
};

// ── 던전 토치(Dungeon Torch): 돌벽 + 횃불 호박색 + 엠버 레드 ──
export const darkTheme = createTheme(vars, {
  ...scale,
  color: {
    bg: '#12100c', // 따뜻한 near-black
    surface: '#1b1811', // 카드
    surface2: '#262117', // 입력/행
    surface3: '#322b1d', // hover/elevated
    border: '#3a3222',
    borderStrong: '#52472f',
    text: '#f0e8d8',
    textMuted: '#b3a488',
    textFaint: '#7d7259',
    primary: '#e08a2b', // 횃불 호박색
    primaryHover: '#f0a03f',
    primaryActive: '#c27320',
    onPrimary: '#1a1206',
    accent: '#d9433a', // 엠버 레드
    accentHover: '#e85a4f',
    success: '#8ab34a',
    danger: '#e0483d',
    dangerHover: '#ef6155',
    wall: '#3a3020', // 돌/흙벽
    road: '#14110b',
    resolve: 'rgba(224, 138, 43, 0.28)',
    gridLine: 'rgba(255, 200, 120, 0.05)',
    glow: 'rgba(255, 150, 50, 0.6)', // 횃불 발광
    overlay: 'rgba(8, 6, 3, 0.72)',
  },
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.5)',
    md: '0 8px 24px rgba(0, 0, 0, 0.5)',
    lg: '0 18px 48px rgba(0, 0, 0, 0.6)',
    focus: '0 0 0 3px rgba(224, 138, 43, 0.4)',
    glow: '0 0 22px rgba(255, 150, 50, 0.45)',
  },
});

export const lightTheme = createTheme(vars, {
  ...scale,
  color: {
    bg: '#f2ece0', // 양피지
    surface: '#fffdf8',
    surface2: '#f6f0e4',
    surface3: '#ece2cf',
    border: '#e5dcc8',
    borderStrong: '#d3c6a8',
    text: '#241d10',
    textMuted: '#6b5f45',
    textFaint: '#9a8d6e',
    primary: '#c26a12', // 깊은 호박색
    primaryHover: '#a85a0c',
    primaryActive: '#8f4c08',
    onPrimary: '#ffffff',
    accent: '#b8362e',
    accentHover: '#a02a23',
    success: '#5f9433',
    danger: '#c23127',
    dangerHover: '#a5251c',
    wall: '#d8c9a8', // 밝은 돌
    road: '#fbf7ee',
    resolve: 'rgba(194, 106, 18, 0.2)',
    gridLine: 'rgba(120, 90, 30, 0.07)',
    glow: 'rgba(200, 110, 20, 0.35)',
    overlay: 'rgba(240, 234, 220, 0.7)',
  },
  shadow: {
    sm: '0 1px 2px rgba(90, 70, 30, 0.12)',
    md: '0 8px 24px rgba(90, 70, 30, 0.16)',
    lg: '0 18px 48px rgba(90, 70, 30, 0.22)',
    focus: '0 0 0 3px rgba(194, 106, 18, 0.35)',
    glow: '0 0 22px rgba(194, 106, 18, 0.3)',
  },
});
