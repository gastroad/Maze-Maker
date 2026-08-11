import { ABSOLUTE_WALL } from '@type/maze';

import {
  createGame,
  step,
  elapsedMs,
  parMs,
  computeStars,
  enterSideView,
  exitSideView,
  SPEED,
  PLAYER_HALF,
  WIN_DIST,
  JUMP_MAX_HEIGHT,
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
});

describe('높이(z)와 시점 전환', () => {
  /** 한 줄짜리 미로를 만들고 사이드뷰(행 고정)로 세운 상태를 돌려준다. */
  function sideOf(
    heights: number[],
    startCol = 0,
  ): { maze: MazeLike; state: GameState } {
    const maze: MazeLike = {
      mazeData: [heights],
      start: { x: 0, y: startCol },
      end: { x: 9, y: 9 },
    };
    // 좌우로 움직이던 중이어야 행이 고정된다(가로축 = 열)
    return {
      maze,
      state: enterSideView({ ...createGame(maze), lastMove: 'h' }),
    };
  }

  /** 착지할 때까지 진행한다(점프 입력은 주지 않아 재점프하지 않는다). */
  function untilGrounded(
    state: GameState,
    maze: MazeLike,
    input: Input,
    maxFrames = 300,
  ): GameState {
    let s = state;
    for (let i = 0; i < maxFrames; i++) {
      s = step(s, maze, input, 1 / 60, 1000 + i * 17);
      if (s.grounded) return s;
    }
    return s;
  }

  describe('탑다운 통과 판정', () => {
    it('발 높이보다 높은 칸에는 들어가지 못한다', () => {
      const m: MazeLike = {
        mazeData: [[0, 1, 0]],
        start: { x: 0, y: 0 },
        end: { x: 9, y: 9 },
      };
      const s = run(createGame(m), m, { x: 0, y: 1 }, 120);
      // 높이 1 턱 앞에서 막힌다
      expect(s.pos.y).toBeLessThanOrEqual(1 - PLAYER_HALF + 1e-3);
    });

    it('발 높이와 같은 칸은 통과한다 — 2층 통로', () => {
      const m: MazeLike = {
        mazeData: [[2, 2, 2]],
        start: { x: 0, y: 0 },
        end: { x: 9, y: 9 },
      };
      // 높이 2 지형 위에 서 있는 상태(z=2)에서 출발
      const s = run(createGame(m), m, { x: 0, y: 1 }, 120);
      expect(s.z).toBe(2);
      expect(s.pos.y).toBeGreaterThan(2); // 막히지 않고 끝까지 이동
    });

    it('높은 지대에서 낮은 칸으로 나가면 떨어진다', () => {
      const m: MazeLike = {
        mazeData: [[2, 2, 0, 0]],
        start: { x: 0, y: 0 },
        end: { x: 9, y: 9 },
      };
      const s = run(createGame(m), m, { x: 0, y: 1 }, 180);
      expect(s.pos.y).toBeGreaterThan(2); // 낮은 칸으로 넘어갔고
      expect(s.z).toBe(0); // 바닥까지 떨어졌다
      expect(s.grounded).toBe(true);
    });
  });

  describe('사이드뷰 점프', () => {
    it('바닥에서 점프하면 높이 1 턱을 넘는다', () => {
      const { maze, state } = sideOf([0, 1, 0, 0]);
      let s = step(state, maze, { x: -1, y: 1 }, 1 / 60, 1000); // 점프 + 전진
      for (let i = 0; i < 40; i++) {
        s = step(s, maze, { x: 0, y: 1 }, 1 / 60, 1000 + i * 17);
      }
      expect(s.pos.y).toBeGreaterThan(2); // 턱을 넘어갔다
    });

    it('바닥에서 점프해도 높이 2 벽은 넘지 못한다', () => {
      const { maze, state } = sideOf([0, 2, 0, 0]);
      let s = state;
      for (let i = 0; i < 60; i++) {
        // 계속 점프를 시도해도 넘지 못한다
        s = step(s, maze, { x: -1, y: 1 }, 1 / 60, 1000 + i * 17);
      }
      expect(s.pos.y).toBeLessThanOrEqual(1 - PLAYER_HALF + 1e-3);
    });

    it('점프 최대 높이는 1과 2 사이에 있다 — 맵 디자인의 기준선', () => {
      expect(JUMP_MAX_HEIGHT).toBeGreaterThan(1);
      expect(JUMP_MAX_HEIGHT).toBeLessThan(2);
    });

    it('턱 위에서 다시 점프하면 높이 2에 올라선다 — 계단 지형', () => {
      const { maze, state } = sideOf([0, 1, 2, 2]);
      let s = step(state, maze, { x: -1, y: 1 }, 1 / 60, 1000); // 1단 점프
      s = untilGrounded(s, maze, { x: 0, y: 1 });
      expect(s.z).toBe(1); // 턱 위에 착지

      s = step(s, maze, { x: -1, y: 1 }, 1 / 60, 2000); // 2단 점프
      s = untilGrounded(s, maze, { x: 0, y: 1 });
      expect(s.z).toBe(2); // 2층에 올라섰다
    });

    it('절대벽(9)은 어떤 높이에서도 넘지 못한다', () => {
      const { maze, state } = sideOf([0, 1, 2, ABSOLUTE_WALL]);
      let s = state;
      // 계속 점프하며 전진 — 계단을 타고 오를 수 있는 데까지 오른다
      for (let i = 0; i < 300; i++) {
        s = step(s, maze, { x: -1, y: 1 }, 1 / 60, 1000 + i * 17);
      }
      s = untilGrounded(s, maze, { x: 0, y: 1 });
      expect(s.z).toBeLessThanOrEqual(2); // 절대벽 위에는 올라설 수 없고
      expect(s.pos.y).toBeLessThanOrEqual(3 - PLAYER_HALF + 1e-3); // 넘어가지도 못한다
    });
  });

  describe('시점 전환 왕복', () => {
    const open: MazeLike = {
      mazeData: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      start: { x: 1, y: 1 },
      end: { x: 9, y: 9 },
    };

    it('탑다운 → 사이드뷰 → 탑다운 후 좌표가 보존된다', () => {
      const s0 = createGame(open);
      const side = enterSideView(s0);
      const back = exitSideView(side);
      expect(back).not.toBeNull();
      expect(back!.mode).toBe('top');
      expect(back!.pos).toEqual(s0.pos);
    });

    it('세로로 움직이던 중이면 열이, 가로로 움직이던 중이면 행이 고정된다', () => {
      expect(enterSideView({ ...createGame(open), lastMove: 'v' }).axis).toBe(
        'col',
      );
      expect(enterSideView({ ...createGame(open), lastMove: 'h' }).axis).toBe(
        'row',
      );
    });

    it('공중에서는 탑다운으로 돌아갈 수 없다', () => {
      const side = enterSideView(createGame(open));
      expect(exitSideView({ ...side, grounded: false })).toBeNull();
    });

    it('높은 위치에서 복귀하면 그 높이가 유지된다 — 2층으로 가는 유일한 길', () => {
      const m: MazeLike = {
        mazeData: [[0, 1, 2, 2, 2]],
        start: { x: 0, y: 0 },
        end: { x: 9, y: 9 },
      };
      // 계단(0→1→2)을 올라 높이 2 위에 선다
      let s = enterSideView({ ...createGame(m), lastMove: 'h' });
      s = step(s, m, { x: -1, y: 1 }, 1 / 60, 1000);
      s = untilGrounded(s, m, { x: 0, y: 1 });
      s = step(s, m, { x: -1, y: 1 }, 1 / 60, 2000);
      s = untilGrounded(s, m, { x: 0, y: 1 });
      expect(s.z).toBe(2);
      expect(s.grounded).toBe(true);

      const back = exitSideView(s);
      expect(back).not.toBeNull();
      expect(back!.mode).toBe('top');
      expect(back!.z).toBe(2); // 높이를 안고 탑다운으로 복귀
    });
  });

  describe('도착 판정', () => {
    it('다른 층으로 도착점 위를 지나가면 승리하지 않는다', () => {
      const m: MazeLike = {
        mazeData: [[2, 2, 2]],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 2 }, // 도착점의 지형 높이는 2
      };
      // 같은 높이(2)로 도착하면 승리한다
      const s = run(createGame(m), m, { x: 0, y: 1 }, 200);
      expect(s.z).toBe(2);
      expect(s.status).toBe('won');
    });

    it('도착점과 높이가 다르면 승리 판정이 나지 않는다', () => {
      const m: MazeLike = {
        mazeData: [[0, 0, 0]],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 2 },
      };
      const near = createGame(m);
      // 도착점 바로 위를 2층 높이로 지나가는 상태
      const flying = { ...near, pos: { x: 0.5, y: 2.5 }, z: 2 };
      const s = step(flying, m, { x: 0, y: 0 }, 1 / 60, 1000);
      expect(s.status).not.toBe('won');
    });
  });
});
