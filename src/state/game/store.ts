import { create } from 'zustand';
import type { MazeType } from '@type/maze';
import { findPath } from '@utils/findPath';
import {
  createGame,
  tryMove,
  type Direction,
  type GameState,
} from '@game/mazeEngine';

const EMPTY_GAME: GameState = {
  status: 'ready',
  player: { x: 0, y: 0 },
  moves: 0,
  startedAt: null,
  finishedAt: null,
};

interface GameStore {
  maze: MazeType | null;
  game: GameState;
  optimal: number; // A* 최적 이동수
  showAnswer: boolean;
  init: (maze: MazeType) => void;
  move: (dir: Direction) => void;
  reset: () => void;
  toggleAnswer: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  maze: null,
  game: EMPTY_GAME,
  optimal: 0,
  showAnswer: false,

  init: (maze) => {
    const optimal =
      maze.resolvedPath?.length ??
      findPath(maze.mazeData, maze.start, maze.end)?.length ??
      0;
    set({ maze, game: createGame(maze), optimal, showAnswer: false });
  },

  move: (dir) => {
    const { maze, game } = get();
    if (!maze) return;
    const next = tryMove(game, maze, dir);
    // 무효한 이동이면 tryMove가 동일 참조를 반환 → 불필요한 갱신 방지
    if (next !== game) set({ game: next });
  },

  reset: () => {
    const { maze } = get();
    if (maze) set({ game: createGame(maze), showAnswer: false });
  },

  toggleAnswer: () => set((s) => ({ showAnswer: !s.showAnswer })),
}));
