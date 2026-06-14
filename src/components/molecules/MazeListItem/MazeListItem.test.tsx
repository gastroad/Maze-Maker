import { render, fireEvent } from '@testing-library/react';
import MazeListItem, { MazeListItemProps } from './MazeListItem';
import { mockMaze } from '@mock/maze';

describe('MazeListItem', () => {
  const defaultProps: MazeListItemProps = {
    maze: mockMaze,
  };

  it('render MazeListItem', () => {
    const { container, getByText } = render(<MazeListItem {...defaultProps} />);

    const itemElement = container.querySelector('.maze-list-item');
    const titleElement = getByText(mockMaze.title);
    const nameElement = getByText(mockMaze.name);

    expect(itemElement).toBeInTheDocument;
    expect(titleElement).toBeInTheDocument;
    expect(nameElement).toBeInTheDocument;
  });

  it('render MazeListItem without title', () => {
    const props: MazeListItemProps = { maze: { ...mockMaze, title: '' } };
    const { getByText } = render(<MazeListItem {...props} />);

    const titleElement = getByText('제목 없음');
    expect(titleElement).toBeInTheDocument;
  });

  it('render MazeListItem without name', () => {
    const props: MazeListItemProps = { maze: { ...mockMaze, name: '' } };
    const { getByText } = render(<MazeListItem {...props} />);

    const nameElement = getByText('unknown');
    expect(nameElement).toBeInTheDocument;
  });
});
