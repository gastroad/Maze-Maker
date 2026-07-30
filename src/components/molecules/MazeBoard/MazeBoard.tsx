import { FC } from 'react';

import MazeCell from '@components/atoms/MazeCell';
import { MazeBoardType, MazeSizeType } from '@type/maze';

import * as s from './MazeBoard.css';

export interface MazeBoardProps extends MazeBoardType {
  height: number;
  handleMazeCellClick?: ({ col, row }: MazeSizeType) => void;
}
const MazeBoard: FC<MazeBoardProps> = ({
  mazeData,
  start,
  end,
  height,
  resolvedPath,
  handleMazeCellClick = () => {},
}) => {
  return (
    <div
      className={s.board}
      style={{
        height: height,
        gridTemplateRows: `repeat(${mazeData.length}, 1fr)`,
      }}
    >
      {mazeData.map((col, i) => {
        return (
          <div
            key={`maze-${i}`}
            className={s.col}
            style={{
              gridTemplateColumns: `repeat(${col.length}, 1fr)`,
            }}
          >
            {col.map((row, j) => {
              const isStartPoint = Boolean(start.x == i && start.y == j);
              const isEndPoint = Boolean(end.x == i && end.y == j);
              const isWall = Boolean(row === 1);
              const isResolvedPath = Boolean(
                resolvedPath?.filter((way) => way.x == i && way.y == j).length,
              );
              const type = isStartPoint
                ? 'start'
                : isEndPoint
                ? 'end'
                : isWall
                ? 'wall'
                : isResolvedPath
                ? 'resolve'
                : 'road';
              return (
                <MazeCell
                  key={`maze-${i}-${j}`}
                  type={type}
                  handleMazeCellClick={handleMazeCellClick}
                  col={i}
                  row={j}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default MazeBoard;
