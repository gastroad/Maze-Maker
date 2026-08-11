import { create } from 'zustand';
import type { PathStep } from '@utils/findPath';
import {
  ABSOLUTE_WALL,
  type MazeSizeType,
  type MazeDataType,
  type PointType,
} from '@type/maze';

export interface MazeStateType {
  title: string;
  name: string;
  mazeSize: MazeSizeType;
}

export interface StartEndStateType {
  start: PointType;
  end: PointType;
}

/**
 * 편집 브러시. 시작/도착 지점은 좌표 하나뿐이라 높이 페인팅과 성격이 달라
 * 종류를 나눠 둔다.
 */
export type MakerBrush =
  | { kind: 'start' }
  | { kind: 'end' }
  | { kind: 'height'; value: number };

/** 팔레트에 노출할 높이와 그 의미. 값의 뜻은 @type/maze 참고. */
export const HEIGHT_BRUSHES: { value: number; label: string; hint: string }[] = [
  { value: 0, label: '바닥', hint: '어디서든 지나갈 수 있는 길' },
  { value: 1, label: '턱', hint: '옆에서 보면 점프로 넘을 수 있다' },
  { value: 2, label: '벽', hint: '넘을 수 없다. 위는 2층 통로가 된다' },
  { value: 3, label: '높은 벽', hint: '2층에서 점프해야 오른다' },
  { value: ABSOLUTE_WALL, label: '외벽', hint: '어떤 높이에서도 넘을 수 없다' },
];

interface MakerState {
  maze: MazeStateType;
  brush: MakerBrush;
  mazeData: MazeDataType;
  startEnd: StartEndStateType;
  resolvedPath: PointType[];
  pathPreview: PathStep[] | null;
  setMaze: (maze: MazeStateType) => void;
  setBrush: (brush: MakerBrush) => void;
  /** 한 칸에 현재 브러시를 적용한다. 드래그 페인팅이 매 프레임 호출한다. */
  paint: (row: number, col: number) => void;
  setMazeData: (mazeData: MazeDataType) => void;
  /**
   * 판을 새 크기로 옮긴다. 겹치는 칸은 그대로 두고, 줄어든 쪽은 잘라내며
   * 늘어난 쪽은 바닥(0)으로 채운다. 크기를 바꿀 때마다 판을 0 으로 리셋하면
   * 편집하던 내용이 경고도 없이 날아가기 때문이다.
   */
  resizeBoard: (size: MazeSizeType) => void;
  setStartEnd: (startEnd: StartEndStateType) => void;
  setResolvedPath: (resolvedPath: PointType[]) => void;
  /** '경로 확인'으로 계산한 최적 경로. 편집 중 표시용이라 저장과는 별개다. */
  setPathPreview: (pathPreview: PathStep[] | null) => void;
  reset: () => void;
}

const createInitialState = () => ({
  maze: { title: '', name: '', mazeSize: { rows: 5, cols: 5 } },
  brush: { kind: 'start' } as MakerBrush,
  mazeData: Array.from({ length: 5 }, () => Array(5).fill(0)) as MazeDataType,
  startEnd: { start: { x: 0, y: 0 }, end: { x: 4, y: 4 } },
  resolvedPath: [] as PointType[],
  pathPreview: null as PathStep[] | null,
});

export const useMakerStore = create<MakerState>((set) => ({
  ...createInitialState(),
  setMaze: (maze) => set({ maze }),
  setBrush: (brush) => set({ brush }),

  paint: (row, col) =>
    set((s) => {
      if (row < 0 || col < 0 || row >= s.mazeData.length) return s;
      if (col >= s.mazeData[0].length) return s;

      const brush = s.brush;
      if (brush.kind === 'start') {
        const { start } = s.startEnd;
        if (start.x === row && start.y === col) return s;
        return {
          startEnd: { ...s.startEnd, start: { x: row, y: col } },
          pathPreview: null,
        };
      }
      if (brush.kind === 'end') {
        const { end } = s.startEnd;
        if (end.x === row && end.y === col) return s;
        return {
          startEnd: { ...s.startEnd, end: { x: row, y: col } },
          pathPreview: null,
        };
      }

      // 같은 값이면 상태를 바꾸지 않는다 — 드래그 중 매 프레임 리렌더를 막는다.
      if (s.mazeData[row][col] === brush.value) return s;
      // 지형이 바뀌면 계산해 둔 경로는 더 이상 유효하지 않다
      // 바뀐 행만 새로 만든다(기존에는 클릭 한 번에 전체 배열을 복사했다).
      const next = s.mazeData.slice();
      next[row] = next[row].slice();
      next[row][col] = brush.value;
      return { mazeData: next, pathPreview: null };
    }),

  setMazeData: (mazeData) => set({ mazeData }),

  resizeBoard: ({ rows, cols }) =>
    set((s) => {
      const same =
        s.mazeData.length === rows && s.mazeData[0]?.length === cols;
      if (same) return s;
      const mazeData = Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => s.mazeData[row]?.[col] ?? 0),
      ) as MazeDataType;
      // 시작·도착이 새 판 밖으로 나가면 안쪽으로 끌어당긴다
      const clamp = (p: PointType): PointType => ({
        x: Math.min(Math.max(p.x, 0), Math.max(rows - 1, 0)),
        y: Math.min(Math.max(p.y, 0), Math.max(cols - 1, 0)),
      });
      return {
        mazeData,
        startEnd: {
          start: clamp(s.startEnd.start),
          end: clamp(s.startEnd.end),
        },
        // 판이 바뀌면 계산해 둔 경로는 더 이상 유효하지 않다
        pathPreview: null,
      };
    }),

  setStartEnd: (startEnd) => set({ startEnd }),
  setResolvedPath: (resolvedPath) => set({ resolvedPath }),
  setPathPreview: (pathPreview) => set({ pathPreview }),
  reset: () => set(createInitialState()),
}));
