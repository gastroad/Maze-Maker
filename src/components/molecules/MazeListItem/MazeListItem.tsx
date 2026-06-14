import { FC } from 'react';
import Link from 'next/link';

import { MazeType } from '@type/maze';

import './MazeListItem.scss';

export interface MazeListItemProps {
  maze: MazeType;
}
const MazeListItem: FC<MazeListItemProps> = ({ maze }) => {
  return (
    <li className="maze-list-item">
      <Link className="link" href={`/maplist/${maze.id}`}>
        <p className="maze-list-item-title">{maze.title || '제목 없음'}</p>
        <div className="maze-list-item-info">
          <span>{maze.name || 'unknown'}</span>
          <span>
            {maze.mazeData[0].length} * {maze.mazeData.length}
          </span>
        </div>
      </Link>
    </li>
  );
};
export default MazeListItem;
