import { render, fireEvent } from '@testing-library/react';
import MazeBoard, { MazeBoardProps } from './MazeBoard';
import {
  mockStart,
  mockEnd,
  mockMazeData,
  mockResolvedPath,
} from '@mock/maze';

describe('MazeBoard', () => {
  const handleMazeCellClick = vi.fn();
  const defaultProps: MazeBoardProps = {
    height: 400,
    handleMazeCellClick,
    start: mockStart,
    end: mockEnd,
    mazeData: mockMazeData,
    resolvedPath: mockResolvedPath,
  };

  beforeEach(() => handleMazeCellClick.mockClear());

  it('5x5 격자를 렌더한다 (열 5, 셀 25)', () => {
    const { container } = render(<MazeBoard {...defaultProps} />);
    const board = container.firstElementChild!;
    // board > 열(div) > 셀(div)
    expect(board.querySelectorAll(':scope > div')).toHaveLength(5);
    expect(board.querySelectorAll(':scope > div > div')).toHaveLength(25);
  });

  it('셀 클릭 시 handleMazeCellClick 을 호출한다', () => {
    const { container } = render(<MazeBoard {...defaultProps} />);
    const cell = container.querySelector(':scope > div > div > div')!;
    fireEvent.click(cell);
    expect(handleMazeCellClick).toHaveBeenCalledTimes(1);
  });
});
