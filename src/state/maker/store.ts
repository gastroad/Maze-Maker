import { create } from 'zustand';
import { CellType, MazeSizeType, MazeDataType, PointType } from '@type/maze';

export interface MazeStateType {
  title: string;
  name: string;
  mazeSize: MazeSizeType;
}

export interface StartEndStateType {
  start: PointType;
  end: PointType;
}

interface MakerState {
  maze: MazeStateType;
  currentType: CellType;
  mazeData: MazeDataType;
  startEnd: StartEndStateType;
  resolvedPath: PointType[];
  setMaze: (maze: MazeStateType) => void;
  setCurrentType: (currentType: CellType) => void;
  setMazeData: (mazeData: MazeDataType) => void;
  setStartEnd: (startEnd: StartEndStateType) => void;
  setResolvedPath: (resolvedPath: PointType[]) => void;
  reset: () => void;
}

const createInitialState = () => ({
  maze: { title: '', name: '', mazeSize: { row: 5, col: 5 } },
  currentType: 'start' as CellType,
  mazeData: Array.from({ length: 5 }, () => Array(5).fill(0)) as MazeDataType,
  startEnd: { start: { x: 0, y: 0 }, end: { x: 4, y: 4 } },
  resolvedPath: [] as PointType[],
});

export const useMakerStore = create<MakerState>((set) => ({
  ...createInitialState(),
  setMaze: (maze) => set({ maze }),
  setCurrentType: (currentType) => set({ currentType }),
  setMazeData: (mazeData) => set({ mazeData }),
  setStartEnd: (startEnd) => set({ startEnd }),
  setResolvedPath: (resolvedPath) => set({ resolvedPath }),
  reset: () => set(createInitialState()),
}));
