import { style } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const joystick = style({
  position: 'relative',
  width: '120px',
  height: '120px',
  margin: '0 auto',
  borderRadius: vars.radius.pill,
  background: `radial-gradient(circle at center, ${vars.color.surface3}, ${vars.color.surface2})`,
  border: `1px solid ${vars.color.border}`,
  touchAction: 'none',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  cursor: 'grab',
  selectors: {
    '&:active': { cursor: 'grabbing' },
  },
});

export const thumb = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '48px',
  height: '48px',
  margin: '-24px 0 0 -24px',
  borderRadius: '50%',
  background: vars.color.primary,
  boxShadow: `${vars.shadow.md}, 0 0 14px ${vars.color.glow}`,
  pointerEvents: 'none',
});
