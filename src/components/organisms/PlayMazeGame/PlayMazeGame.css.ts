import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

// 데스크톱: [보드] [사이드 덱] / 모바일: 세로 스택
export const wrap = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 240px',
  gap: vars.space.lg,
  alignItems: 'start',
  '@media': {
    'screen and (max-width: 760px)': { gridTemplateColumns: '1fr' },
  },
});

export const game = style({
  position: 'relative',
  width: '100%',
  maxWidth: 'min(100%, 520px)',
  margin: '0 auto',
  touchAction: 'none',
});

export const deck = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.md,
});

export const hint = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textFaint,
  textAlign: 'center',
  lineHeight: 1.5,
});
