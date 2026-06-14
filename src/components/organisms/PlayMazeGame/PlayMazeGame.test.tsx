import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import PlayMazeGame from './PlayMazeGame';
import { mockMaze } from '@mock/maze';

describe('PlayMazeGame', () => {
  const defaultProps = {
    maze: mockMaze,
  };
  it('render PlayMazeGame', () => {
    const { container } = render(
      <RecoilRoot>
        <PlayMazeGame {...defaultProps} />
      </RecoilRoot>,
    );

    const mazeGameElement = container.querySelector('.maze-game');
    expect(mazeGameElement).toBeInTheDocument();
  });

  it('handles player movement with arrow keys', () => {
    const { container } = render(
      <RecoilRoot>
        <PlayMazeGame {...defaultProps} />
      </RecoilRoot>,
    );
    fireEvent.keyDown(window, { code: 'ArrowRight' });
    fireEvent.keyDown(window!, { code: 'ArrowDown' });
    // TODO 검증 로직 추가
  });
});
