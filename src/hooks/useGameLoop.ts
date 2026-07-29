import { RefObject, useEffect, useRef } from 'react';

import {
  createGame,
  step,
  PLAYER_HALF,
  type Input,
  type GameState,
  type MazeLike,
} from '@game/mazeEngine';
import { useGameStore } from '@state/game/store';

export interface BoardMetrics {
  side: number; // 보드 한 변(px, 정사각)
  rows: number;
  cols: number;
}

interface UseGameLoopArgs {
  maze: MazeLike;
  playerRef: RefObject<HTMLElement | null>;
  metricsRef: RefObject<BoardMetrics>;
  getInput: () => Input;
}

const MAX_DT = 0.05; // 탭 전환 등으로 프레임이 크게 벌어져도 벽 관통 방지

/**
 * requestAnimationFrame 루프로 물리를 전진시키고, 플레이어 DOM 의 transform 을
 * 직접(imperative) 갱신한다. status/타이머 변화 시에만 store 에 반영해 리렌더를 최소화한다.
 */
export default function useGameLoop({
  maze,
  playerRef,
  metricsRef,
  getInput,
}: UseGameLoopArgs) {
  const runId = useGameStore((s) => s.runId);
  const syncRun = useGameStore((s) => s.syncRun);

  const stateRef = useRef<GameState>(createGame(maze));

  // init/reset(runId) 또는 미로 변경 시 물리 상태 재생성
  useEffect(() => {
    stateRef.current = createGame(maze);
  }, [runId, maze]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let prevStatus = stateRef.current.status;
    let prevStarted = stateRef.current.startedAt;

    const frame = (t: number) => {
      const dt = Math.min((t - last) / 1000, MAX_DT);
      last = t;

      const s = step(stateRef.current, maze, getInput(), dt, Date.now());
      stateRef.current = s;

      const el = playerRef.current;
      const m = metricsRef.current;
      if (el && m.side > 0) {
        const cellW = m.side / m.cols;
        const cellH = m.side / m.rows;
        const d = Math.min(cellW, cellH) * PLAYER_HALF * 2;
        const cx = s.pos.y * cellW;
        const cy = s.pos.x * cellH;
        el.style.transform = `translate3d(${cx - d / 2}px, ${cy - d / 2}px, 0)`;
      }

      if (s.status !== prevStatus || s.startedAt !== prevStarted) {
        prevStatus = s.status;
        prevStarted = s.startedAt;
        syncRun({
          status: s.status,
          startedAt: s.startedAt,
          finishedAt: s.finishedAt,
        });
      }

      // 승리하면 루프 정지(reset 시 runId 변경으로 이 effect 가 재실행되어 재개)
      if (s.status !== 'won') raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [maze, runId, playerRef, metricsRef, getInput, syncRun]);
}
