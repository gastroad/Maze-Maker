import { FC } from 'react';
import { CellType, MazeSizeType } from '@type/maze';

import './MazeCell.scss';

export interface MazeCellProps extends MazeSizeType {
  type: CellType;
  handleMazeCellClick?: ({ col, row }: MazeSizeType) => void;
}
const MazeCell: FC<MazeCellProps> = ({
  type,
  handleMazeCellClick = () => {},
  col,
  row,
}) => {
  return (
    <div
      className={`maze-cell ${type}`}
      draggable
      onClick={() => handleMazeCellClick({ col, row })}
      onDragEnter={() => handleMazeCellClick({ col, row })}
    />
  );
};
export default MazeCell;
