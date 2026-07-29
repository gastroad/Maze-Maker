import { create } from 'zustand';
import { PointType } from '@type/maze';

interface GameState {
  player: PointType;
  score: number;
  answer: boolean;
  setPlayer: (player: PointType) => void;
  setScore: (score: number | ((prev: number) => number)) => void;
  setAnswer: (answer: boolean) => void;
  resetPlayer: () => void;
  resetScore: () => void;
  resetAnswer: () => void;
}

const createInitialState = () => ({
  player: { x: 0, y: 0 },
  score: 0,
  answer: false,
});

export const useGameStore = create<GameState>((set) => ({
  ...createInitialState(),
  setPlayer: (player) => set({ player }),
  setScore: (score) =>
    set((state) => ({
      score: typeof score === 'function' ? score(state.score) : score,
    })),
  setAnswer: (answer) => set({ answer }),
  resetPlayer: () => set({ player: createInitialState().player }),
  resetScore: () => set({ score: createInitialState().score }),
  resetAnswer: () => set({ answer: createInitialState().answer }),
}));
