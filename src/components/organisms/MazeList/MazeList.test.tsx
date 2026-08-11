import { render } from '@testing-library/react';
import MazeList from './MazeList';
import { mockMaze } from '@mock/maze';

describe('MazeList', () => {
  // id 가 곧 key 이므로 서로 다른 id 를 준다(DB 목록과 같은 조건)
  const defaultProps = {
    mazeList: [mockMaze, { ...mockMaze, id: 'test-id-2' }],
  };

  it('항목 수만큼 리스트를 렌더한다', () => {
    const { container } = render(<MazeList {...defaultProps} />);

    expect(container.firstElementChild?.tagName).toBe('UL');
    expect(container.querySelectorAll('li')).toHaveLength(2);
  });
});
