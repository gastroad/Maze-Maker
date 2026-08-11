import { FC } from 'react';

import MazeListItem from '@components/molecules/MazeListItem';
import { MazeType } from '@type/maze';

import { list } from './MazeList.css';

export interface MazeListProps {
  mazeList: MazeType[];
  // 현재 로그인 사용자 id (서버에서 전달). 각 항목의 소유 여부 판단에 사용.
  currentUserId?: string;
}

const MazeList: FC<MazeListProps> = ({ mazeList, currentUserId }) => {
  return (
    <ul className={list}>
      {/* DB 에서 온 목록은 언제나 id 가 있다. 인덱스로 키를 잡으면 항목을 지웠을 때
          지워진 자리에 뒤 항목이 밀려들어와 잔상이 남는다. */}
      {mazeList.map((maze, index) => {
        return (
          <MazeListItem
            key={maze.id ?? `maze-${index}`}
            maze={maze}
            currentUserId={currentUserId}
          />
        );
      })}
    </ul>
  );
};

export default MazeList;
