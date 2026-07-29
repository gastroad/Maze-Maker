'use client';
import { FC } from 'react';

import type { Direction } from '@game/mazeEngine';

import './PlayDpad.scss';

export interface PlayDpadProps {
  onMove: (dir: Direction) => void;
}
const PlayDpad: FC<PlayDpadProps> = ({ onMove }) => {
  return (
    <div className="play-dpad" role="group" aria-label="이동 조작">
      <button
        className="play-dpad-btn up"
        onClick={() => onMove('up')}
        aria-label="위로 이동"
      >
        ▲
      </button>
      <button
        className="play-dpad-btn left"
        onClick={() => onMove('left')}
        aria-label="왼쪽으로 이동"
      >
        ◀
      </button>
      <button
        className="play-dpad-btn right"
        onClick={() => onMove('right')}
        aria-label="오른쪽으로 이동"
      >
        ▶
      </button>
      <button
        className="play-dpad-btn down"
        onClick={() => onMove('down')}
        aria-label="아래로 이동"
      >
        ▼
      </button>
    </div>
  );
};
export default PlayDpad;
