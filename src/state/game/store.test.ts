import { computeStars } from '@game/mazeEngine';
import { mockMaze } from '@mock/maze';
import type { MazeType } from '@type/maze';

import { useGameStore } from './store';

describe('game store', () => {
  it('저장된 resolvedPath 가 있으면 그 길이를 별점 기준선으로 쓴다', () => {
    useGameStore.getState().init(mockMaze);
    expect(useGameStore.getState().optimal).toBe(mockMaze.resolvedPath!.length);
  });

  // 회귀: `resolvedPath?.length ?? findPath(...)` 는 빈 배열에서 0 을 그대로 통과시켜
  // par 가 0 이 되고 computeStars 가 언제나 3 을 돌려줬다. createMaze 는 실제로
  // resolvedPath 를 [] 로 저장할 수 있으므로 빈 배열도 fallback 을 타야 한다.
  it('resolvedPath 가 빈 배열이면 직접 계산해서 채운다', () => {
    const maze: MazeType = { ...mockMaze, resolvedPath: [] };
    useGameStore.getState().init(maze);

    const { optimal } = useGameStore.getState();
    expect(optimal).toBeGreaterThan(0);
    // 기준선이 살아 있어야 느린 주파에서 별이 깎인다
    expect(computeStars(60_000, optimal)).toBeLessThan(3);
  });

  it('resolvedPath 가 아예 없어도 직접 계산한다', () => {
    const { resolvedPath: _omitted, ...rest } = mockMaze;
    useGameStore.getState().init(rest);
    expect(useGameStore.getState().optimal).toBeGreaterThan(0);
  });
});
