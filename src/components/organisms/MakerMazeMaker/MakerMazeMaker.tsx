'use client';
import { FC, useEffect, useState } from 'react';

import MazeCanvas from '@components/molecules/MazeCanvas';
import SlicePreview from '@components/molecules/SlicePreview';
import { useMakerStore } from '@state/maker/store';
import type { SliceAxis } from '@game/mazeEngine';

import * as s from './MakerMazeMaker.css';

export interface MakerMazeMakerProps {}
const MakerMazeMaker: FC<MakerMazeMakerProps> = () => {
  const mazeData = useMakerStore((state) => state.mazeData);
  const startEnd = useMakerStore((state) => state.startEnd);
  const maze = useMakerStore((state) => state.maze);
  const paint = useMakerStore((state) => state.paint);
  const pathPreview = useMakerStore((state) => state.pathPreview);
  const resizeBoard = useMakerStore((state) => state.resizeBoard);

  // 크기가 바뀌면 편집하던 내용을 새 크기로 옮긴다(잘라내기/0 으로 채우기).
  // 판을 읽고 쓰는 일은 store 안에서 끝나므로 startEnd·mazeData 를 의존성에
  // 걸 필요가 없다 — 예전에는 그래서 exhaustive-deps 를 꺼야 했다.
  useEffect(() => {
    resizeBoard(maze.mazeSize);
  }, [maze.mazeSize, resizeBoard]);

  // 커서가 놓인 줄의 단면을 옆에 세워 보여 준다
  const [hover, setHover] = useState<{ row: number; col: number } | null>(null);
  const [sliceAxis, setSliceAxis] = useState<SliceAxis>('row');
  const sliceIndex = hover ? (sliceAxis === 'col' ? hover.col : hover.row) : null;
  const marker = hover ? (sliceAxis === 'col' ? hover.row : hover.col) : null;

  return (
    <div className={s.wrap}>
      <div className={s.maker}>
        <MazeCanvas
          mazeData={mazeData}
          start={startEnd.start}
          end={startEnd.end}
          path={pathPreview}
          onPaint={paint}
          onHoverChange={setHover}
          showValues
          label="미로 편집기"
        />
      </div>
      <SlicePreview
        mazeData={mazeData}
        axis={sliceAxis}
        index={sliceIndex}
        marker={marker}
        onToggleAxis={() =>
          setSliceAxis((a) => (a === 'col' ? 'row' : 'col'))
        }
      />
    </div>
  );
};
export default MakerMazeMaker;
