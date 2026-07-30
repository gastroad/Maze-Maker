import { forwardRef } from 'react';
import Image from 'next/image';

import CharURL from '@assets/img/cha.png';

import { player } from './MazePlayer.css';

export interface MazePlayerProps {
  /** 플레이어 지름(px). 셀 크기에서 계산해 전달한다. */
  size: number;
}

/**
 * 격자 위에 떠 있는 absolute 오버레이. 위치(transform)는 게임 루프가
 * 매 프레임 직접 갱신하므로 여기서는 크기와 외형만 담당한다.
 */
const MazePlayer = forwardRef<HTMLDivElement, MazePlayerProps>(
  ({ size }, ref) => (
    <div
      className={player}
      ref={ref}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Image src={CharURL} alt="" fill sizes="64px" priority />
    </div>
  ),
);
MazePlayer.displayName = 'MazePlayer';

export default MazePlayer;
