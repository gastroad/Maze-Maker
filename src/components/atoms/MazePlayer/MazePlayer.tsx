import { FC } from 'react';
import Image from 'next/image';

import CharURL from '@assets/img/cha.png';
import { PointType } from '@type/maze';

import './MazePlayer.scss';

export interface MazePlayerProps {
  playerSize: { width: number; height: number };
  player: PointType;
}
const MazePlayer: FC<MazePlayerProps> = ({ playerSize, player }) => {
  return (
    <div
      className="maze-player"
      style={{
        ...playerSize,
        left: player.y * playerSize.width,
        top: player.x * playerSize.height,
      }}
    >
      <Image
        style={{
          width: playerSize.width * 0.8,
          height: playerSize.height * 0.8,
        }}
        src={CharURL}
        alt="캐릭터"
      />
    </div>
  );
};
export default MazePlayer;
