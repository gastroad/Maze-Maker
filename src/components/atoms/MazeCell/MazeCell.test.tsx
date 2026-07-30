import { render, fireEvent } from '@testing-library/react';
import MazeCell, { MazeCellProps } from './MazeCell';

describe('MazeCell', () => {
  const type = 'start';
  const handleMazeCellClick = vi.fn();
  const defaultProps: MazeCellProps = {
    type,
    handleMazeCellClick,
    col: 1,
    row: 1,
  };

  it('render start MazeCell', () => {
    const { container } = render(<MazeCell {...defaultProps} />);
    const mazeCellElement = container.querySelector('.maze-cell');
    expect(mazeCellElement).toBeInTheDocument();
    expect(mazeCellElement).toHaveClass('maze-cell', 'start');
  });

  it('render end MazeCell', () => {
    const props: MazeCellProps = { ...defaultProps, type: 'end' };
    const { container } = render(<MazeCell {...props} />);
    const mazeCellElement = container.querySelector('.maze-cell');
    expect(mazeCellElement).toBeInTheDocument();
    expect(mazeCellElement).toHaveClass('maze-cell', 'end');
  });

  it('render wall MazeCell', () => {
    const props: MazeCellProps = { ...defaultProps, type: 'wall' };
    const { container } = render(<MazeCell {...props} />);
    const mazeCellElement = container.querySelector('.maze-cell');
    expect(mazeCellElement).toBeInTheDocument();
    expect(mazeCellElement).toHaveClass('maze-cell', 'wall');
  });

  it('render road MazeCell', () => {
    const props: MazeCellProps = { ...defaultProps, type: 'road' };
    const { container } = render(<MazeCell {...props} />);
    const mazeCellElement = container.querySelector('.maze-cell');
    expect(mazeCellElement).toBeInTheDocument();
    expect(mazeCellElement).toHaveClass('maze-cell', 'road');
  });

  it('calls handleMazeCellClick', () => {
    const { container } = render(<MazeCell {...defaultProps} />);
    const mazeCellElement = container.querySelector('.maze-cell');
    expect(mazeCellElement).toBeInTheDocument();

    fireEvent.click(mazeCellElement!);
    expect(handleMazeCellClick).toHaveBeenCalledWith({ col: 1, row: 1 });
    expect(handleMazeCellClick).toHaveBeenCalledTimes(1);
  });
});
