import { FC } from 'react';
import Link from 'next/link';

import { MazeType } from '@type/maze';
import MazeBoard from '@components/molecules/MazeBoard';
import DeleteMazeButton from '@components/molecules/DeleteMazeButton';

import * as s from './MazeListItem.css';

export interface MazeListItemProps {
  maze: MazeType;
  // 현재 로그인 사용자 id (서버에서 전달). maze.userId 와 같으면 소유자.
  currentUserId?: string;
}
const MazeListItem: FC<MazeListItemProps> = ({ maze, currentUserId }) => {
  const isOwner = !!maze.userId && maze.userId === currentUserId;
  const cols = maze.mazeData[0].length;
  const rows = maze.mazeData.length;

  return (
    <li className={s.item}>
      <Link className={s.card} href={`/maplist/${maze.id}`}>
        <div className={s.thumb}>
          <MazeBoard
            mazeData={maze.mazeData}
            start={maze.start}
            end={maze.end}
            height={150}
            resolvedPath={[]}
          />
        </div>
        <span className={s.title}>{maze.title || '제목 없음'}</span>
        <span className={s.meta}>
          {cols}×{rows} · {maze.name || 'unknown'}
        </span>
      </Link>
      {isOwner && maze.id && <DeleteMazeButton mazeId={maze.id} />}
    </li>
  );
};
export default MazeListItem;
