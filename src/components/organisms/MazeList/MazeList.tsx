import { FC } from 'react';

import MazeListItem from '@components/molecules/MazeListItem';
import { MazeType } from '@type/maze';

import './MazeList.scss';

export interface MazeListProps {
  mazeList: MazeType[];
  // 현재 로그인 사용자 id (서버에서 전달). 각 항목의 소유 여부 판단에 사용.
  currentUserId?: string;
}

const MazeList: FC<MazeListProps> = ({ mazeList, currentUserId }) => {
  return (
    <ul className="maze-list">
      {mazeList.map((maze, index) => {
        return (
          <MazeListItem
            key={`maze-${index}`}
            maze={maze}
            currentUserId={currentUserId}
          />
        );
      })}
    </ul>
  );
};

export default MazeList;
