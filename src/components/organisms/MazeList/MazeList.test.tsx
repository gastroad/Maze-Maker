import React from 'react';
import { render } from '@testing-library/react';
import MazeList from './MazeList';
import { mockMaze } from '@mock/maze';

describe('MazeList', () => {
  const mazeList = [mockMaze, mockMaze];
  const defaultProps = {
    mazeList,
  };

  it('render MazeList', () => {
    const { container } = render(<MazeList {...defaultProps} />);

    const mazeListElement = container.querySelector('.maze-list');
    const mazeListItemElements = container.querySelectorAll('.maze-list-item');

    expect(mazeListElement).toBeInTheDocument();
    expect(mazeListItemElements.length).toEqual(2);
  });
});
