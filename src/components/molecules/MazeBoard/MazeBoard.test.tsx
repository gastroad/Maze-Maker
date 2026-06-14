import { render, fireEvent } from '@testing-library/react';
import MazeBoard, { MazeBoardProps } from './MazeBoard';
import {
  mockStart,
  mockEnd,
  mockMazeData,
  mockResolvedPath,
} from '@mock/maze';

describe('MazeBoard', () => {
  const height = 400;
  const handleMazeCellClick = jest.fn();
  const start = mockStart;
  const end = mockEnd;
  const mazeData = mockMazeData;
  const resolvedPath = mockResolvedPath;
  const defaultProps: MazeBoardProps = {
    height,
    handleMazeCellClick,
    start,
    end,
    mazeData,
    resolvedPath,
  };

  it('render MazeBoard', () => {
    const { container } = render(<MazeBoard {...defaultProps} />);
    const boardElement = container.querySelector('.maze-board');
    const colElements = boardElement!.querySelectorAll('.maze-board-col');
    const cellElements = boardElement!.querySelectorAll('.maze-cell');

    expect(boardElement).toBeInTheDocument;
    expect(colElements.length).toEqual(5);
    expect(cellElements.length).toEqual(25);
  });

  it('calls handleMazeCellClick', () => {
    const { container } = render(<MazeBoard {...defaultProps} />);
    const boardElement = container.querySelector('.maze-board');
    const cellElement = boardElement!.querySelector('.maze-cell');

    expect(cellElement).toBeInTheDocument;

    fireEvent.click(cellElement!);
    expect(handleMazeCellClick).toHaveBeenCalledTimes(1);
  });
});
