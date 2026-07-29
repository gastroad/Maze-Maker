import type { MazeDataType, PointType } from '@type/maze';

// 좌표계: x = 행(row), y = 열(col). mazeData[x][y] 로 접근한다.
export type Direction = 'up' | 'down' | 'left' | 'right';
export type GameStatus = 'ready' | 'playing' | 'won';

export interface GameState {
  status: GameStatus;
  player: PointType;
  moves: number;
  startedAt: number | null; // 첫 이동 시각(ms)
  finishedAt: number | null; // 도착 시각(ms)
}

/** 이동에 필요한 미로 정보(엔진은 이 최소 형태에만 의존한다) */
export interface MazeLike {
  mazeData: MazeDataType;
  start: PointType;
  end: PointType;
}

const DELTA: Record<Direction, PointType> = {
  up: { x: -1, y: 0 },
  down: { x: 1, y: 0 },
  left: { x: 0, y: -1 },
  right: { x: 0, y: 1 },
};

/** 방향키/문자키를 Direction 으로 매핑 (없으면 null) */
export function keyToDirection(key: string): Direction | null {
  switch (key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      return 'up';
    case 'ArrowDown':
    case 's':
    case 'S':
      return 'down';
    case 'ArrowLeft':
    case 'a':
    case 'A':
      return 'left';
    case 'ArrowRight':
    case 'd':
    case 'D':
      return 'right';
    default:
      return null;
  }
}

/** 미로 시작점에서 대기(ready) 상태로 새 게임을 만든다. */
export function createGame(maze: MazeLike): GameState {
  return {
    status: 'ready',
    player: { ...maze.start },
    moves: 0,
    startedAt: null,
    finishedAt: null,
  };
}

function isWalkable(mazeData: MazeDataType, x: number, y: number): boolean {
  return (
    x >= 0 &&
    x < mazeData.length &&
    y >= 0 &&
    y < mazeData[0].length &&
    mazeData[x][y] === 0
  );
}

/**
 * 이동 시도. 유효한 이동일 때만 위치·이동수를 갱신하고 승리를 판정한다.
 * 벽/경계로 막히면 상태를 그대로 반환한다(이동수 증가 없음).
 */
export function tryMove(
  state: GameState,
  maze: MazeLike,
  dir: Direction,
  now: number = Date.now(),
): GameState {
  if (state.status === 'won') return state;

  const delta = DELTA[dir];
  const next: PointType = {
    x: state.player.x + delta.x,
    y: state.player.y + delta.y,
  };

  if (!isWalkable(maze.mazeData, next.x, next.y)) {
    return state;
  }

  const won = next.x === maze.end.x && next.y === maze.end.y;
  return {
    status: won ? 'won' : 'playing',
    player: next,
    moves: state.moves + 1,
    startedAt: state.startedAt ?? now,
    finishedAt: won ? now : null,
  };
}

/** 경과 시간(ms). 시작 전이면 0, 완료 후면 완료까지의 시간으로 고정된다. */
export function elapsedMs(state: GameState, now: number = Date.now()): number {
  if (state.startedAt === null) return 0;
  return (state.finishedAt ?? now) - state.startedAt;
}

/** 최적 경로(optimal) 대비 이동 효율로 별점(1~3)을 매긴다. */
export function computeStars(moves: number, optimal: number): number {
  if (optimal <= 0 || moves <= 0) return 1;
  if (moves <= optimal) return 3;
  if (moves <= Math.ceil(optimal * 1.5)) return 2;
  return 1;
}

export interface GameResult {
  moves: number;
  timeMs: number;
  optimal: number;
  stars: number;
}

export function getResult(state: GameState, optimal: number): GameResult {
  return {
    moves: state.moves,
    timeMs: elapsedMs(state),
    optimal,
    stars: computeStars(state.moves, optimal),
  };
}
