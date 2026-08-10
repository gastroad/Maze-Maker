import { create } from 'zustand';
import type { MazeType } from '@type/maze';
import { findPath } from '@utils/findPath';
import type { GameStatus, ViewMode } from '@game/mazeEngine';

// 물리 상태(pos/vel/z)는 성능을 위해 게임 루프의 ref 가 소유한다.
// store 는 UI 가 필요로 하는 슬라이스(상태·타이머·결과 재료)만 보관한다.
interface GameStore {
  maze: MazeType | null;
  optimal: number; // A* 최적 이동수(별점 par 기준)
  showAnswer: boolean;

  status: GameStatus;
  mode: ViewMode;
  z: number; // 현재 층 — HUD 표시용
  startedAt: number | null;
  finishedAt: number | null;
  runId: number; // init/reset 시 증가 → 게임 루프가 물리 상태를 재생성하는 신호
  flipNonce: number; // 증가하면 게임 루프가 시점 전환을 시도한다
  notice: string | null; // 전환 실패 등 짧은 안내

  init: (maze: MazeType) => void;
  reset: () => void;
  toggleAnswer: () => void;
  requestFlip: () => void;
  setNotice: (notice: string | null) => void;
  // 게임 루프가 상태 전이 시에만 호출(매 프레임 아님)
  syncRun: (r: {
    status: GameStatus;
    mode: ViewMode;
    z: number;
    startedAt: number | null;
    finishedAt: number | null;
  }) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  maze: null,
  optimal: 0,
  showAnswer: false,

  status: 'ready',
  mode: 'top',
  z: 0,
  startedAt: null,
  finishedAt: null,
  runId: 0,
  flipNonce: 0,
  notice: null,

  init: (maze) => {
    const optimal =
      maze.resolvedPath?.length ??
      findPath(maze.mazeData, maze.start, maze.end)?.length ??
      0;
    set((s) => ({
      maze,
      optimal,
      showAnswer: false,
      status: 'ready',
      mode: 'top',
      z: 0,
      startedAt: null,
      finishedAt: null,
      runId: s.runId + 1,
      notice: null,
    }));
  },

  reset: () =>
    set((s) => ({
      showAnswer: false,
      status: 'ready',
      mode: 'top',
      z: 0,
      startedAt: null,
      finishedAt: null,
      runId: s.runId + 1,
      notice: null,
    })),

  toggleAnswer: () => set((s) => ({ showAnswer: !s.showAnswer })),

  requestFlip: () => set((s) => ({ flipNonce: s.flipNonce + 1 })),

  setNotice: (notice) => set({ notice }),

  syncRun: ({ status, mode, z, startedAt, finishedAt }) =>
    set({ status, mode, z, startedAt, finishedAt }),
}));
