import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

// 편집 보드 + 우측 툴 레일 (모바일은 세로 스택)
export const body = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 180px',
  gap: vars.space.lg,
  alignItems: 'start',
  marginTop: vars.space.md,
  '@media': {
    'screen and (max-width: 720px)': { gridTemplateColumns: '1fr' },
  },
});
