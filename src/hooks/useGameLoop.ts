import { RefObject, useEffect, useRef } from 'react';

import {
  createGame,
  step,
  enterSideView,
  exitSideView,
  type Input,
  type GameState,
  type MazeLike,
} from '@game/mazeEngine';
import { render, type RenderOptions, type ViewMetrics } from '@game/renderer';
import { useGameStore } from '@state/game/store';

import useThemePalette from './useThemePalette';

interface UseGameLoopArgs {
  maze: MazeLike;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  getInput: () => Input;
  /** 렌더 옵션(정답 경로 등). ref 로 받아 토글해도 루프를 재시작하지 않는다. */
  optionsRef?: RefObject<RenderOptions>;
  /**
   * 매 프레임 물리 상태를 넘긴다. 허브가 입구 도달을 판정하는 데 쓴다 —
   * 도착점이 하나뿐인 스테이지와 달리 허브에는 목적지가 여럿이라
   * 엔진의 승리 판정만으로는 부족하다.
   */
  onFrame?: (state: GameState) => void;
}

const MAX_DT = 0.05; // 탭 전환 등으로 프레임이 크게 벌어져도 벽 관통 방지
const MIN_CELL = 26; // 큰 미로에서 셀이 무한정 작아지지 않게 하는 하한
const MAX_CELL = 64; // 작은 미로에서 과하게 확대되지 않게 하는 상한

/**
 * requestAnimationFrame 루프로 물리를 전진시키고 캔버스에 직접 그린다.
 * 셀 하나당 DOM 노드를 만들지 않으므로 미로가 커져도 렌더 비용이 늘지 않는다.
 * status/타이머/시점 변화 시에만 store 에 반영해 리렌더를 최소화한다.
 */
export default function useGameLoop({
  maze,
  canvasRef,
  getInput,
  optionsRef,
  onFrame,
}: UseGameLoopArgs) {
  const runId = useGameStore((s) => s.runId);
  const syncRun = useGameStore((s) => s.syncRun);

  const stateRef = useRef<GameState>(createGame(maze));
  // 루프가 매 프레임 스스로 다시 그리므로 테마 변경에 리렌더가 필요 없다
  const { paletteRef } = useThemePalette();

  // init/reset(runId) 또는 미로 변경 시 물리 상태 재생성
  useEffect(() => {
    stateRef.current = createGame(maze);
  }, [runId, maze]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    let prevStatus = stateRef.current.status;
    let prevStarted = stateRef.current.startedAt;
    let prevMode = stateRef.current.mode;
    let prevZ = stateRef.current.z;
    let handledFlip = useGameStore.getState().flipNonce;

    // 캔버스 내부 해상도를 표시 크기 × DPR 로 맞춘다(픽셀아트가 뭉개지지 않게)
    const metrics = (): ViewMetrics => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const span = Math.max(maze.mazeData.length, maze.mazeData[0].length);
      const cell = Math.max(
        MIN_CELL * dpr,
        Math.min(MAX_CELL * dpr, Math.min(w, h) / span),
      );
      return { width: w, height: h, cell };
    };

    const frame = (t: number) => {
      const dt = Math.min((t - last) / 1000, MAX_DT);
      last = t;

      // 시점 전환 요청 처리 — 물리 상태를 소유한 이 루프에서만 수행한다
      const nonce = useGameStore.getState().flipNonce;
      if (nonce !== handledFlip) {
        handledFlip = nonce;
        const cur = stateRef.current;
        if (cur.mode === 'top') {
          // 축을 지정하지 않았으면(단축키 등) 예전처럼 마지막 이동 방향을 쓴다
          const axis = useGameStore.getState().flipAxis ?? undefined;
          stateRef.current = enterSideView(cur, axis);
        } else {
          const back = exitSideView(cur);
          if (back) stateRef.current = back;
          else
            useGameStore
              .getState()
              .setNotice('착지한 뒤에 돌아갈 수 있습니다.');
        }
      }

      const s = step(stateRef.current, maze, getInput(), dt, Date.now());
      stateRef.current = s;
      onFrame?.(s);

      const pal = paletteRef.current;
      if (pal) render(ctx, maze, s, metrics(), pal, optionsRef?.current ?? {});

      if (
        s.status !== prevStatus ||
        s.startedAt !== prevStarted ||
        s.mode !== prevMode ||
        Math.abs(s.z - prevZ) > 1e-3
      ) {
        prevStatus = s.status;
        prevStarted = s.startedAt;
        prevMode = s.mode;
        prevZ = s.z;
        syncRun({
          status: s.status,
          mode: s.mode,
          z: s.z,
          startedAt: s.startedAt,
          finishedAt: s.finishedAt,
        });
      }

      raf = requestAnimationFrame(frame);
    };

    // 탭이 숨겨지면 루프를 멈춘다. 안 멈추면 보이지도 않는 화면을 계속 그리며
    // CPU 를 쓰고, 무엇보다 기록 타이머가 실제 시각 기준이라 잠깐 자리를 비운
    // 사이 시간이 그대로 쌓인다. 돌아올 때 자리를 비운 만큼 시작 시각을 밀어
    // 준다.
    let pausedAt: number | null = null;
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
        pausedAt = Date.now();
        return;
      }
      if (pausedAt !== null) {
        const away = Date.now() - pausedAt;
        const cur = stateRef.current;
        if (cur.startedAt !== null && cur.finishedAt === null) {
          stateRef.current = { ...cur, startedAt: cur.startedAt + away };
        }
        pausedAt = null;
      }
      last = performance.now(); // 멈춰 있던 시간이 dt 로 몰리지 않게
      if (!raf) raf = requestAnimationFrame(frame);
    };
    document.addEventListener('visibilitychange', onVisibility);

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [
    maze,
    runId,
    canvasRef,
    getInput,
    optionsRef,
    onFrame,
    syncRun,
    paletteRef,
  ]);
}
