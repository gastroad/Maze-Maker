'use client';
import { FC, useEffect } from 'react';

import MazeBoard from '@components/molecules/MazeBoard';
import useResponsiveHeight from '@hooks/useResponsiveHeight';
import { useMakerStore } from '@state/maker/store';

import { maker } from './MakerMazeMaker.css';
import { MazeDataType, MazeSizeType } from '@type/maze';

export interface MakerMazeMakerProps {}
const MakerMazeMaker: FC<MakerMazeMakerProps> = () => {
  const mazeData = useMakerStore((state) => state.mazeData);
  const setMazeData = useMakerStore((state) => state.setMazeData);
  const startEnd = useMakerStore((state) => state.startEnd);
  const setStartEnd = useMakerStore((state) => state.setStartEnd);
  const maze = useMakerStore((state) => state.maze);
  const currentType = useMakerStore((state) => state.currentType);
  const resolvedPath = useMakerStore((state) => state.resolvedPath);

  useEffect(() => {
    const mazeData = new Array(maze.mazeSize.col).fill(0).map(() => {
      return new Array(maze.mazeSize.row).fill(0);
    });
    setMazeData(mazeData);
  }, [maze.mazeSize]);

  const handleMazeCellClick = ({ col, row }: MazeSizeType) => {
    let nextMazeData: MazeDataType;
    switch (currentType) {
      case 'start':
      case 'end':
        setStartEnd({ ...startEnd, [currentType]: { x: col, y: row } });
        return;
      case 'wall':
      case 'road':
        nextMazeData = mazeData.map((cell, i) =>
          i === col
            ? cell.map((value, j) =>
                j === row ? (currentType === 'wall' ? 1 : 0) : value,
              )
            : cell,
        );
        setMazeData(nextMazeData);
        return;
    }
  };

  const { elementRef, height } = useResponsiveHeight(0, 1, 1);
  return (
    <div className={maker} style={{ height: height }} ref={elementRef}>
      <MazeBoard
        mazeData={mazeData}
        start={startEnd.start}
        end={startEnd.end}
        height={height}
        resolvedPath={resolvedPath}
        handleMazeCellClick={handleMazeCellClick}
      />
    </div>
  );
};
export default MakerMazeMaker;
