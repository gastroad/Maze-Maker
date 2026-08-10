'use client';
import { FC } from 'react';

import { useGameStore } from '@state/game/store';
import type { SliceAxis } from '@game/mazeEngine';

import * as s from './AxisFlipButtons.css';

/**
 * 어느 줄을 세울지 그림으로 보여 주는 버튼.
 * 강조된 칸이 곧 사이드뷰에서 걸어 다닐 단면이다 — "가로/세로"나 "행/열" 같은
 * 말은 사람마다 뒤집어 이해하므로 글자 대신 격자로 보여 준다.
 */
const AxisIcon: FC<{ axis: SliceAxis }> = ({ axis }) => (
  <svg className={s.icon} viewBox="0 0 24 24" aria-hidden focusable="false">
    {[0, 1, 2, 3].map((i) =>
      [0, 1, 2, 3].map((j) => {
        // axis 'row' = 행 고정(가로 줄이 세워짐), 'col' = 열 고정(세로 줄)
        const active = axis === 'row' ? i === 2 : j === 1;
        return (
          <rect
            key={`${i}-${j}`}
            x={j * 6 + 0.5}
            y={i * 6 + 0.5}
            width={5}
            height={5}
            rx={1}
            className={active ? s.cellActive : s.cellIdle}
          />
        );
      }),
    )}
  </svg>
);

export interface AxisFlipButtonsProps {}

const AxisFlipButtons: FC<AxisFlipButtonsProps> = () => {
  const mode = useGameStore((st) => st.mode);
  const requestFlip = useGameStore((st) => st.requestFlip);
  const setPreviewAxis = useGameStore((st) => st.setPreviewAxis);

  if (mode === 'side') {
    return (
      <div className={s.wrap}>
        <button
          type="button"
          className={s.back}
          onClick={() => requestFlip()}
        >
          위에서 보기
        </button>
      </div>
    );
  }

  // 손을 올리면(모바일은 누르는 동안) 어느 줄이 세워질지 보드에 표시된다
  const preview = (axis: SliceAxis | null) => () => setPreviewAxis(axis);

  return (
    <div className={s.wrap}>
      {(
        [
          { axis: 'row', label: '가로로 자르기' },
          { axis: 'col', label: '세로로 자르기' },
        ] as const
      ).map(({ axis, label }) => (
        <button
          key={axis}
          type="button"
          className={s.button}
          onClick={() => requestFlip(axis)}
          onMouseEnter={preview(axis)}
          onMouseLeave={preview(null)}
          onPointerDown={preview(axis)}
          onPointerUp={preview(null)}
          onPointerCancel={preview(null)}
          onFocus={preview(axis)}
          onBlur={preview(null)}
        >
          <AxisIcon axis={axis} />
          <span className={s.label}>{label}</span>
        </button>
      ))}
    </div>
  );
};

export default AxisFlipButtons;
