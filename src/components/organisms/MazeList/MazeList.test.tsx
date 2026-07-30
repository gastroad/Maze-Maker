import { render } from '@testing-library/react';
import MazeList from './MazeList';
import { mockMaze } from '@mock/maze';

describe('MazeList', () => {
  const defaultProps = { mazeList: [mockMaze, mockMaze] };

  it('항목 수만큼 리스트를 렌더한다', () => {
    const { container } = render(<MazeList {...defaultProps} />);

    expect(container.firstElementChild?.tagName).toBe('UL');
    expect(container.querySelectorAll('li')).toHaveLength(2);
  });
});
