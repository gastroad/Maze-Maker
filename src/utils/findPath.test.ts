import { ABSOLUTE_WALL, type MazeDataType } from '@type/maze';

import { findPath, findPathDetailed } from './findPath';

const P = (x: number, y: number) => ({ x, y });

describe('findPath', () => {
  it('평지에서는 최단 직선을 찾는다(시작점 제외, 도착점 포함)', () => {
    const maze: MazeDataType = [[0, 0, 0]];
    expect(findPath(maze, P(0, 0), P(0, 2))).toEqual([P(0, 1), P(0, 2)]);
  });

  it('넘을 수 없는 벽은 돌아간다', () => {
    const maze: MazeDataType = [
      [0, 3, 0],
      [0, 0, 0],
    ];
    const path = findPath(maze, P(0, 0), P(0, 2));
    expect(path).not.toBeNull();
    expect(path).not.toContainEqual(P(0, 1)); // 벽을 통과하지 않는다
    expect(path![path!.length - 1]).toEqual(P(0, 2));
  });

  it('갈 수 없으면 null 을 돌려준다', () => {
    const maze: MazeDataType = [[0, ABSOLUTE_WALL, 0]];
    expect(findPath(maze, P(0, 0), P(0, 2))).toBeNull();
  });

  describe('높이 규칙', () => {
    it('한 단 높은 턱은 넘어간다 — 시점 전환으로 오를 수 있다', () => {
      const maze: MazeDataType = [[0, 1, 0]];
      expect(findPath(maze, P(0, 0), P(0, 2))).toEqual([P(0, 1), P(0, 2)]);
    });

    it('두 단 높은 벽은 점프로 못 넘는다', () => {
      const maze: MazeDataType = [[0, 2, 0]];
      expect(findPath(maze, P(0, 0), P(0, 2))).toBeNull();
    });

    it('계단(0→1→2)을 타고 2층까지 올라간다', () => {
      const maze: MazeDataType = [[0, 1, 2]];
      const path = findPathDetailed(maze, P(0, 0), P(0, 2));
      expect(path).not.toBeNull();
      expect(path!.map((s) => s.height)).toEqual([1, 2]);
      expect(path!.every((s) => s.climbed)).toBe(true);
    });

    it('높은 곳에서 낮은 곳으로는 그냥 떨어진다', () => {
      const maze: MazeDataType = [[2, 2, 0]];
      const path = findPathDetailed(maze, P(0, 0), P(0, 2));
      expect(path).not.toBeNull();
      expect(path!.map((s) => s.climbed)).toEqual([false, false]);
    });

    it('절대벽은 어떤 높이에서도 넘지 못한다', () => {
      // 2층까지 올라가도 절대벽 너머로는 갈 수 없다
      const maze: MazeDataType = [[0, 1, 2, ABSOLUTE_WALL, 0]];
      expect(findPath(maze, P(0, 0), P(0, 4))).toBeNull();
    });

    it('올라가는 길과 평지가 같은 길이면 평지를 고른다', () => {
      // 전환 + 점프는 그냥 걷는 것보다 비싸다
      const maze: MazeDataType = [
        [0, 1],
        [0, 0],
      ];
      const path = findPath(maze, P(0, 0), P(1, 1));
      expect(path).toEqual([P(1, 0), P(1, 1)]);
    });

    it('climbed 는 그 칸에 오르려고 전환이 필요했는지를 가리킨다', () => {
      const maze: MazeDataType = [[0, 1, 0]];
      const path = findPathDetailed(maze, P(0, 0), P(0, 2))!;
      expect(path.map((s) => s.climbed)).toEqual([true, false]);
    });
  });

  describe('경계 조건', () => {
    it('시작과 도착이 같으면 빈 경로다', () => {
      expect(findPath([[0]], P(0, 0), P(0, 0))).toEqual([]);
    });

    it('판 밖 좌표는 null 이다', () => {
      const maze: MazeDataType = [[0, 0]];
      expect(findPath(maze, P(0, 0), P(5, 5))).toBeNull();
      expect(findPath(maze, P(-1, 0), P(0, 1))).toBeNull();
    });

    it('도착점이 절대벽이면 null 이다', () => {
      expect(findPath([[0, ABSOLUTE_WALL]], P(0, 0), P(0, 1))).toBeNull();
    });
  });

  it('100x100 미로에서도 경로를 찾는다', () => {
    // 한 칸 폭 통로가 지그재그로 이어지는 미로
    const N = 100;
    const maze: MazeDataType = Array.from({ length: N }, () =>
      Array(N).fill(2),
    );
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (r % 2 === 0) maze[r][c] = 0;
      }
    }
    for (let r = 1; r < N; r += 2) {
      maze[r][r % 4 === 1 ? N - 1 : 0] = 0; // 짝수 행끼리 잇는 통로
    }

    const path = findPath(maze, P(0, 0), P(N - 1, 0));
    expect(path).not.toBeNull();
    expect(path![path!.length - 1]).toEqual(P(N - 1, 0));
  });
});
