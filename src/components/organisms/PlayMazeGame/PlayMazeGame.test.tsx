import { render } from '@testing-library/react';
import PlayMazeGame from './PlayMazeGame';
import { mockMaze } from '@mock/maze';
import { useGameStore } from '@state/game/store';
import { game } from './PlayMazeGame.css';

describe('PlayMazeGame', () => {
  it('캔버스·조이스틱을 렌더한다', () => {
    const { container } = render(<PlayMazeGame maze={mockMaze} />);
    expect(container.querySelector('.' + game)).toBeInTheDocument();
    // 미로와 플레이어는 DOM 노드가 아니라 캔버스에 그려진다
    expect(container.querySelector('canvas')).toBeInTheDocument();
    // 가상 조이스틱
    expect(
      container.querySelector('[aria-label="이동 조이스틱"]'),
    ).toBeInTheDocument();
  });

  it('시점 배지를 표시한다', () => {
    const { getByText } = render(<PlayMazeGame maze={mockMaze} />);
    expect(getByText('TOP')).toBeInTheDocument();
  });

  it('마운트 시 미로로 게임을 초기화한다(ready + 최적 경로 계산)', () => {
    render(<PlayMazeGame maze={mockMaze} />);
    const s = useGameStore.getState();
    expect(s.status).toBe('ready');
    expect(s.maze).toBe(mockMaze);
    expect(s.optimal).toBeGreaterThan(0);
  });
});
