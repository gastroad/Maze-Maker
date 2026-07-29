import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PlayMazeGame from './PlayMazeGame';
import { mockMaze } from '@mock/maze';

describe('PlayMazeGame', () => {
  const defaultProps = {
    maze: mockMaze,
  };
  it('render PlayMazeGame', () => {
    const { container } = render(<PlayMazeGame {...defaultProps} />);

    const mazeGameElement = container.querySelector('.maze-game');
    expect(mazeGameElement).toBeInTheDocument();
  });

  it('handles player movement with arrow keys', () => {
    render(<PlayMazeGame {...defaultProps} />);
    fireEvent.keyDown(window, { code: 'ArrowRight' });
    fireEvent.keyDown(window, { code: 'ArrowDown' });
    // TODO 검증 로직 추가
  });
});
