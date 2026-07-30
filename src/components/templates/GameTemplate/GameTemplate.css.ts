import { style, globalStyle } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const template = style({
  paddingBottom: vars.space.xl,
});

export const content = style({
  padding: `0 ${vars.space.md}`,
});

export const navBack = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.25rem',
  height: '2.25rem',
  borderRadius: vars.radius.md,
  transition: `background ${vars.transition.base}`,
  selectors: {
    '&:hover': { background: vars.color.surface2 },
    '&:active': { background: vars.color.surface3 },
  },
});
globalStyle(`.${navBack} img`, { width: '1.1rem', height: 'auto' });
// MapTitle(h3) 여백 조정
globalStyle(`.${template} h3`, { margin: '1.25rem 0 1.5rem' });
