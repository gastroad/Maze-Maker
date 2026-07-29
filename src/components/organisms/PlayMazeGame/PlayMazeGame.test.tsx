import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PlayMazeGame from './PlayMazeGame';
import { mockMaze } from '@mock/maze';
import { useGameStore } from '@state/game/store';

describe('PlayMazeGame', () => {
  it('renders the board and starts the player at the maze start', () => {
    const { container } = render(<PlayMazeGame maze={mockMaze} />);

    expect(container.querySelector('.maze-game')).toBeInTheDocument();
    expect(useGameStore.getState().game.player).toEqual(mockMaze.start);
  });

  it('only counts valid moves (blocked by walls / bounds)', () => {
    render(<PlayMazeGame maze={mockMaze} />);

    // (0,0)에서 오른쪽은 벽 → 이동 없음
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(useGameStore.getState().game.moves).toBe(0);

    // 아래로는 이동 가능 → moves 1, 위치 (1,0)
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    const game = useGameStore.getState().game;
    expect(game.moves).toBe(1);
    expect(game.player).toEqual({ x: 1, y: 0 });
  });
});
