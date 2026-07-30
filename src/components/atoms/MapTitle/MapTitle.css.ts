import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const title = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.xxl,
  fontWeight: vars.weight.bold,
  letterSpacing: '-0.02em',
  textAlign: 'center',
  margin: `${vars.space.lg} 0`,
  color: vars.color.text,
  backgroundImage: `linear-gradient(135deg, ${vars.color.text} 0%, ${vars.color.primary} 135%)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});
