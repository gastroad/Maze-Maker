import {
  createGame,
  tryMove,
  elapsedMs,
  computeStars,
  getResult,
  keyToDirection,
  type MazeLike,
} from './mazeEngine';

// 3x3, 시작(0,0) → 도착(2,2), 가운데(1,1)만 벽
const maze: MazeLike = {
  mazeData: [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
  start: { x: 0, y: 0 },
  end: { x: 2, y: 2 },
};

describe('mazeEngine', () => {
  it('시작점에서 ready 상태로 생성된다', () => {
    const s = createGame(maze);
    expect(s.status).toBe('ready');
    expect(s.player).toEqual({ x: 0, y: 0 });
    expect(s.moves).toBe(0);
    expect(s.startedAt).toBeNull();
  });

  it('유효한 이동은 위치와 이동수를 갱신하고 첫 이동에 타이머가 시작된다', () => {
    const s0 = createGame(maze);
    const s1 = tryMove(s0, maze, 'down', 1000);
    expect(s1.player).toEqual({ x: 1, y: 0 });
    expect(s1.moves).toBe(1);
    expect(s1.status).toBe('playing');
    expect(s1.startedAt).toBe(1000);
  });

  it('벽/경계로 막히면 상태가 변하지 않는다(이동수 증가 없음)', () => {
    const s0 = createGame(maze);
    // 경계 밖(위쪽)
    expect(tryMove(s0, maze, 'up')).toBe(s0);
    // 벽으로 이동: (0,0)→down→(1,0) 후 right→(1,1)은 벽
    const s1 = tryMove(s0, maze, 'down', 1);
    const blocked = tryMove(s1, maze, 'right', 2);
    expect(blocked).toBe(s1);
    expect(blocked.moves).toBe(1);
  });

  it('도착점에 닿으면 won 상태가 되고 finishedAt이 기록된다', () => {
    let s = createGame(maze);
    s = tryMove(s, maze, 'down', 1000); // (1,0)
    s = tryMove(s, maze, 'down', 1200); // (2,0)
    s = tryMove(s, maze, 'right', 1400); // (2,1)
    s = tryMove(s, maze, 'right', 1600); // (2,2) 도착
    expect(s.status).toBe('won');
    expect(s.moves).toBe(4);
    expect(s.finishedAt).toBe(1600);
  });

  it('won 이후에는 더 이상 이동하지 않는다', () => {
    let s = createGame(maze);
    ['down', 'down', 'right', 'right'].forEach((d, i) =>
      (s = tryMove(s, maze, d as never, 1000 + i)),
    );
    const after = tryMove(s, maze, 'up', 9999);
    expect(after).toBe(s);
  });

  it('elapsedMs는 완료 시점 기준으로 고정된다', () => {
    let s = createGame(maze);
    s = tryMove(s, maze, 'down', 1000);
    s = tryMove(s, maze, 'down', 1200);
    s = tryMove(s, maze, 'right', 1400);
    s = tryMove(s, maze, 'right', 1600);
    expect(elapsedMs(s, 5000)).toBe(600); // 1600 - 1000, now(5000) 무시
  });

  it('computeStars: 최적 이하=3, 1.5배 이내=2, 그 외=1', () => {
    expect(computeStars(4, 4)).toBe(3);
    expect(computeStars(6, 4)).toBe(2);
    expect(computeStars(10, 4)).toBe(1);
  });

  it('getResult는 이동수·별점을 종합한다', () => {
    let s = createGame(maze);
    s = tryMove(s, maze, 'down', 1000);
    s = tryMove(s, maze, 'down', 1200);
    s = tryMove(s, maze, 'right', 1400);
    s = tryMove(s, maze, 'right', 1600);
    const r = getResult(s, 4);
    expect(r).toMatchObject({ moves: 4, optimal: 4, stars: 3, timeMs: 600 });
  });

  it('keyToDirection은 방향키와 WASD를 매핑한다', () => {
    expect(keyToDirection('ArrowUp')).toBe('up');
    expect(keyToDirection('w')).toBe('up');
    expect(keyToDirection('D')).toBe('right');
    expect(keyToDirection('Enter')).toBeNull();
  });
});
