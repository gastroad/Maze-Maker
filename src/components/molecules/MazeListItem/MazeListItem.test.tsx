import { render } from '@testing-library/react';
import MazeListItem, { MazeListItemProps } from './MazeListItem';
import { mockMaze } from '@mock/maze';

describe('MazeListItem', () => {
  const defaultProps: MazeListItemProps = { maze: mockMaze };

  it('제목과 작성자를 렌더한다', () => {
    const { container, getByText } = render(<MazeListItem {...defaultProps} />);
    expect(container.firstElementChild?.tagName).toBe('LI');
    expect(getByText(mockMaze.title)).toBeInTheDocument();
    expect(getByText(mockMaze.name)).toBeInTheDocument();
  });

  it('제목이 없으면 "제목 없음"을 보여준다', () => {
    const { getByText } = render(
      <MazeListItem maze={{ ...mockMaze, title: '' }} />,
    );
    expect(getByText('제목 없음')).toBeInTheDocument();
  });

  it('작성자가 없으면 "unknown"을 보여준다', () => {
    const { getByText } = render(
      <MazeListItem maze={{ ...mockMaze, name: '' }} />,
    );
    expect(getByText('unknown')).toBeInTheDocument();
  });
});
