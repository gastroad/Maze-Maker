import { render } from '@testing-library/react';
import PlayMazeGame from './PlayMazeGame';
import { mockMaze } from '@mock/maze';
import { useGameStore } from '@state/game/store';

describe('PlayMazeGame', () => {
  it('보드·플레이어·조이스틱을 렌더한다', () => {
    const { container } = render(<PlayMazeGame maze={mockMaze} />);
    expect(container.querySelector('.maze-game')).toBeInTheDocument();
    expect(container.querySelector('.maze-player')).toBeInTheDocument();
    expect(container.querySelector('.joystick')).toBeInTheDocument();
  });

  it('마운트 시 미로로 게임을 초기화한다(ready + 최적 경로 계산)', () => {
    render(<PlayMazeGame maze={mockMaze} />);
    const s = useGameStore.getState();
    expect(s.status).toBe('ready');
    expect(s.maze).toBe(mockMaze);
    expect(s.optimal).toBeGreaterThan(0);
  });
});
