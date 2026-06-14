import { FC } from 'react';

import MazeListItem from '@components/molecules/MazeListItem';
import { MazeType } from '@type/maze';

import './MazeList.scss';

export interface MazeListProps {
  mazeList: MazeType[];
}

const MazeList: FC<MazeListProps> = ({ mazeList }) => {
  return (
    <ul className="maze-list">
      {mazeList.map((maze, index) => {
        return <MazeListItem key={`maze-${index}`} maze={maze} />;
      })}
    </ul>
  );
};

export default MazeList;
