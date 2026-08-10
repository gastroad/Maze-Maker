'use client';
import { FC, useEffect } from 'react';

import MazeCanvas from '@components/molecules/MazeCanvas';
import { useMakerStore } from '@state/maker/store';
import type { MazeDataType } from '@type/maze';

import { maker } from './MakerMazeMaker.css';

export interface MakerMazeMakerProps {}
const MakerMazeMaker: FC<MakerMazeMakerProps> = () => {
  const mazeData = useMakerStore((state) => state.mazeData);
  const setMazeData = useMakerStore((state) => state.setMazeData);
  const startEnd = useMakerStore((state) => state.startEnd);
  const setStartEnd = useMakerStore((state) => state.setStartEnd);
  const maze = useMakerStore((state) => state.maze);
  const paint = useMakerStore((state) => state.paint);
  const resolvedPath = useMakerStore((state) => state.resolvedPath);

  // 크기가 바뀌면 판을 새로 만든다.
  useEffect(() => {
    const { rows, cols } = maze.mazeSize;
    setMazeData(
      Array.from({ length: rows }, () => Array(cols).fill(0)) as MazeDataType,
    );
    // 시작·도착이 새 판 밖으로 나가면 안쪽으로 끌어당긴다
    const clamp = (p: { x: number; y: number }) => ({
      x: Math.min(Math.max(p.x, 0), Math.max(rows - 1, 0)),
      y: Math.min(Math.max(p.y, 0), Math.max(cols - 1, 0)),
    });
    setStartEnd({
      start: clamp(startEnd.start),
      end: clamp(startEnd.end),
    });
    // startEnd 를 의존성에 넣으면 클램프가 자기 자신을 다시 트리거한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maze.mazeSize, setMazeData, setStartEnd]);

  return (
    <div className={maker}>
      <MazeCanvas
        mazeData={mazeData}
        start={startEnd.start}
        end={startEnd.end}
        resolvedPath={resolvedPath}
        onPaint={paint}
        showValues
        label="미로 편집기"
      />
    </div>
  );
};
export default MakerMazeMaker;
