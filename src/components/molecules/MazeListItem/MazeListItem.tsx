import { FC } from 'react';
import Link from 'next/link';

import { MazeType } from '@type/maze';
import DeleteMazeButton from '@components/molecules/DeleteMazeButton';

import * as s from './MazeListItem.css';

export interface MazeListItemProps {
  maze: MazeType;
  // 현재 로그인 사용자 id (서버에서 전달). maze.userId 와 같으면 소유자.
  currentUserId?: string;
}
const MazeListItem: FC<MazeListItemProps> = ({ maze, currentUserId }) => {
  const isOwner = !!maze.userId && maze.userId === currentUserId;

  return (
    <li className={s.item}>
      <Link className={s.link} href={`/maplist/${maze.id}`}>
        <p className={s.title}>{maze.title || '제목 없음'}</p>
        <div className={s.info}>
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
