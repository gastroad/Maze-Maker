import { FC } from 'react';
import Link from 'next/link';

import { MazeType } from '@type/maze';
import DeleteMazeButton from '@components/molecules/DeleteMazeButton';

import './MazeListItem.scss';

export interface MazeListItemProps {
  maze: MazeType;
  // 현재 로그인 사용자 id (서버에서 전달). maze.userId 와 같으면 소유자.
  currentUserId?: string;
}
const MazeListItem: FC<MazeListItemProps> = ({ maze, currentUserId }) => {
  const isOwner = !!maze.userId && maze.userId === currentUserId;

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
      {isOwner && maze.id && <DeleteMazeButton mazeId={maze.id} />}
    </li>
  );
};
export default MazeListItem;
