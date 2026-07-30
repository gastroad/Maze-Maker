import { style, globalStyle } from '@vanilla-extract/css';

import { vars } from '@styles/theme.css';

export const player = style({
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 1,
  // 위치는 게임 루프가 transform 으로 직접 갱신(합성 레이어로 승격).
  willChange: 'transform',
  pointerEvents: 'none',
});

// 캐릭터 이미지: 둥근 형태 + 횃불 글로우(던전 토치)
globalStyle(`.${player} > img`, {
  borderRadius: '50%',
  backgroundColor: '#fff',
  boxShadow: `0 2px 10px ${vars.color.glow}, 0 0 0 2px ${vars.color.primary}`,
});
