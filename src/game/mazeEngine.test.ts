import {
  createGame,
  step,
  elapsedMs,
  parMs,
  computeStars,
  getResult,
  keyToDirection,
  SPEED,
  PLAYER_HALF,
  WIN_DIST,
  type GameState,
  type Input,
  type MazeLike,
} from './mazeEngine';

const NONE: Input = { x: 0, y: 0 };

/** 고정 dt로 여러 프레임을 진행시키는 헬퍼(now 는 dt만큼 증가). */
function run(
  state: GameState,
  maze: MazeLike,
  input: Input,
  frames: number,
  dt = 1 / 60,
  t0 = 1000,
): GameState {
  let s = state;
  for (let i = 0; i < frames; i++) {
    s = step(s, maze, input, dt, t0 + Math.round((i + 1) * dt * 1000));
  }
  return s;
}

describe('mazeEngine (자유 이동)', () => {
  // 한 줄 통로: 도착점은 멀리 둬서 이동/충돌 테스트가 조기 승리하지 않게 함
  const line: MazeLike = {
    mazeData: [[0, 0, 0]],
    start: { x: 0, y: 0 },
    end: { x: 9, y: 9 },
  };

  it('시작점 중심에서 ready 상태로 생성된다', () => {
    const s = createGame(line);
    expect(s.status).toBe('ready');
    expect(s.pos).toEqual({ x: 0.5, y: 0.5 });
    expect(s.vel).toEqual({ x: 0, y: 0 });
    expect(s.startedAt).toBeNull();
  });

  it('입력이 없으면 움직이지 않고 ready 를 유지한다', () => {
    const s = run(createGame(line), line, NONE, 30);
    expect(s.pos).toEqual({ x: 0.5, y: 0.5 });
    expect(s.status).toBe('ready');
    expect(s.startedAt).toBeNull();
  });

  it('입력이 들어오면 이동하고 첫 입력에 타이머가 시작된다', () => {
    const s0 = createGame(line);
    const s1 = step(s0, line, { x: 0, y: 1 }, 1 / 60, 1234);
    expect(s1.pos.y).toBeGreaterThan(0.5);
    expect(s1.status).toBe('playing');
    expect(s1.startedAt).toBe(1234);
  });

  it('벽(경계 포함)을 통과하지 못하고 경계에 정렬된다', () => {
    // 오른쪽으로 계속 밀어도 col2 오른쪽 경계(=벽)를 넘지 못한다
    const s = run(createGame(line), line, { x: 0, y: 1 }, 240);
    // 마지막 통로 셀 col2 의 오른쪽 벽은 y=3, 선단은 3 - PLAYER_HALF 에서 멈춤
    expect(s.pos.y).toBeLessThanOrEqual(3 - PLAYER_HALF + 1e-3);
    expect(s.pos.y).toBeGreaterThan(3 - PLAYER_HALF - 0.1);
  });

  it('막다른 벽에 부딪히면 해당 축 속도가 0이 된다', () => {
    const wall: MazeLike = {
      mazeData: [[0, 1]],
      start: { x: 0, y: 0 },
      end: { x: 9, y: 9 },
    };
    const s = run(createGame(wall), wall, { x: 0, y: 1 }, 120);
    expect(s.pos.y).toBeLessThanOrEqual(1 - PLAYER_HALF + 1e-3);
    expect(Math.abs(s.vel.y)).toBeLessThan(1e-6);
  });

  it('한 축이 벽에 막혀도 다른 축으로 미끄러진다', () => {
    // 2x2 전부 통로. 오른쪽 위 이동 중 위쪽 경계(벽)에 막혀도 오른쪽으로는 진행
    const open: MazeLike = {
      mazeData: [
        [0, 0],
        [0, 0],
      ],
      start: { x: 1, y: 0 },
      end: { x: 9, y: 9 },
    };
    const s = run(createGame(open), open, { x: -1, y: 1 }, 120);
    expect(s.pos.y).toBeGreaterThan(0.5); // 오른쪽으로 미끄러짐
    expect(s.pos.x).toBeLessThanOrEqual(PLAYER_HALF + 1e-3); // 위쪽 경계에 정렬
  });

  it('도착점 셀 중심에 근접하면 won 이 되고 finishedAt 이 기록된다', () => {
    const path: MazeLike = {
      mazeData: [[0, 0, 0]],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 2 },
    };
    const s = run(createGame(path), path, { x: 0, y: 1 }, 240);
    expect(s.status).toBe('won');
    expect(s.finishedAt).not.toBeNull();
    expect(Math.hypot(s.pos.x - 0.5, s.pos.y - 2.5)).toBeLessThanOrEqual(
      WIN_DIST + 1e-6,
    );
  });

  it('won 이후에는 상태가 더 이상 변하지 않는다', () => {
    const path: MazeLike = {
      mazeData: [[0, 0, 0]],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 2 },
    };
    const won = run(createGame(path), path, { x: 0, y: 1 }, 240);
    expect(won.status).toBe('won');
    const after = step(won, path, { x: -1, y: -1 }, 1 / 60, 99999);
    expect(after).toBe(won);
  });

  it('elapsedMs 는 완료 시점 기준으로 고정된다', () => {
    expect(elapsedMs({ startedAt: 1000, finishedAt: 1600 }, 5000)).toBe(600);
    expect(elapsedMs({ startedAt: null, finishedAt: null }, 5000)).toBe(0);
  });

  it('parMs 는 최적 셀 수를 최고 속도로 나눈 이론 시간이다', () => {
    expect(parMs(SPEED)).toBe(1000); // SPEED 셀 → 정확히 1초
    expect(parMs(0)).toBe(0);
  });

  it('computeStars: par 배수가 커질수록 별이 깎인다', () => {
    const par = parMs(10); // ms
    expect(computeStars(par * 1, 10)).toBe(3); // 매우 빠름
    expect(computeStars(par * 3, 10)).toBe(2); // 다소 느림
    expect(computeStars(par * 6, 10)).toBe(1); // 많이 느림
    expect(computeStars(0, 10)).toBe(3); // 시작 시 만점
  });

  it('getResult 는 시간·par·별점을 종합한다', () => {
    const won: GameState = {
      status: 'won',
      pos: { x: 0.5, y: 0.5 },
      vel: { x: 0, y: 0 },
      startedAt: 1000,
      finishedAt: 1000 + parMs(10),
    };
    const r = getResult(won, 10);
    expect(r.timeMs).toBeCloseTo(parMs(10), 6);
    expect(r).toMatchObject({ optimal: 10, stars: 3 });
    expect(r.parMs).toBe(parMs(10));
  });

  it('keyToDirection 은 방향키와 WASD 를 매핑한다', () => {
    expect(keyToDirection('ArrowUp')).toBe('up');
    expect(keyToDirection('w')).toBe('up');
    expect(keyToDirection('D')).toBe('right');
    expect(keyToDirection('Enter')).toBeNull();
  });
});
