import { render, fireEvent } from '@testing-library/react';
import MazeCell, { MazeCellProps } from './MazeCell';
import type { CellType } from '@type/maze';

describe('MazeCell', () => {
  const handleMazeCellClick = vi.fn();
  const base: MazeCellProps = {
    type: 'start',
    handleMazeCellClick,
    col: 1,
    row: 1,
  };

  beforeEach(() => handleMazeCellClick.mockClear());

  it.each(['start', 'end', 'wall', 'road', 'resolve'] as const)(
    '%s 셀을 렌더한다',
    (type: CellType) => {
      const { container } = render(<MazeCell {...base} type={type} />);
      expect(container.firstElementChild).toBeInTheDocument();
    },
  );

  it('클릭 시 col/row 로 핸들러를 호출한다', () => {
    const { container } = render(<MazeCell {...base} />);
    fireEvent.click(container.firstElementChild!);
    expect(handleMazeCellClick).toHaveBeenCalledWith({ col: 1, row: 1 });
    expect(handleMazeCellClick).toHaveBeenCalledTimes(1);
  });
});
