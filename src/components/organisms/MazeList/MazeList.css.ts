import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

// 스테이지 선택 그리드
export const list = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: vars.space.md,
  listStyle: 'none',
});
