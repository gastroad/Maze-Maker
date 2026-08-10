'use client';
import { FC, useCallback, useEffect, useMemo, useRef } from 'react';

import { useGameStore } from '@state/game/store';
import { type Input } from '@game/mazeEngine';
import type { RenderOptions } from '@game/renderer';
import useGameLoop from '@hooks/useGameLoop';
import VirtualJoystick from '@components/molecules/VirtualJoystick';
import PlayResult from '@components/organisms/PlayResult';
import PlayMazeController from '@components/organisms/PlayMazeController';
import { MazeType } from '@type/maze';

import * as s from './PlayMazeGame.css';

export interface PlayMazeGameProps {
  maze: MazeType;
}
const PlayMazeGame: FC<PlayMazeGameProps> = ({ maze }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const init = useGameStore((st) => st.init);
  const status = useGameStore((st) => st.status);
  const mode = useGameStore((st) => st.mode);
  const z = useGameStore((st) => st.z);
  const notice = useGameStore((st) => st.notice);
  const setNotice = useGameStore((st) => st.setNotice);
  const showAnswer = useGameStore((st) => st.showAnswer);
  const requestFlip = useGameStore((st) => st.requestFlip);

  // 정답 경로는 좌표 집합으로 한 번만 만들어 둔다(셀마다 배열을 훑지 않도록)
  const pathSet = useMemo(
    () => new Set(maze.resolvedPath?.map((p) => `${p.x},${p.y}`) ?? []),
    [maze.resolvedPath],
  );
  const optionsRef = useRef<RenderOptions>({});
  useEffect(() => {
    optionsRef.current = { pathSet: showAnswer ? pathSet : undefined };
  }, [showAnswer, pathSet]);

  // 입력 소스: 키보드(불리언) 우선, 없으면 조이스틱(아날로그)
  const keysRef = useRef({ up: false, down: false, left: false, right: false });
  const joyRef = useRef({ x: 0, y: 0 });
  const getInput = useCallback((): Input => {
    const k = keysRef.current;
    const kx = (k.down ? 1 : 0) - (k.up ? 1 : 0);
    const ky = (k.right ? 1 : 0) - (k.left ? 1 : 0);
    if (kx !== 0 || ky !== 0) return { x: kx, y: ky };
    return joyRef.current;
  }, []);

  // 미로가 준비되면 새 게임 시작
  useEffect(() => {
    init(maze);
  }, [maze, init]);

  useGameLoop({ maze, canvasRef, getInput, optionsRef });

  // 키보드 — 방향키/WASD 이동, 스페이스로 시점 전환
  useEffect(() => {
    const MAP: Record<string, keyof typeof keysRef.current> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      w: 'up',
      a: 'left',
      s: 'down',
      d: 'right',
      W: 'up',
      A: 'left',
      S: 'down',
      D: 'right',
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (!e.repeat) requestFlip();
        return;
      }
      const k = MAP[e.key];
      if (k) {
        keysRef.current[k] = true;
        e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const k = MAP[e.key];
      if (k) keysRef.current[k] = false;
    };
    const clear = () => {
      keysRef.current = { up: false, down: false, left: false, right: false };
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clear);
    };
  }, [requestFlip]);

  // 안내 문구는 잠깐만 띄운다
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(null), 2200);
    return () => clearTimeout(id);
  }, [notice, setNotice]);

  const onJoystick = useCallback((v: { x: number; y: number }) => {
    joyRef.current = v;
  }, []);

  return (
    <div className={s.wrap}>
      <div className={s.game}>
        <canvas ref={canvasRef} className={s.canvas} aria-label="미로" />
        <div className={s.hud}>
          <span className={s.badge} data-mode={mode}>
            {mode === 'side' ? 'SIDE' : 'TOP'}
          </span>
          {z > 0 && <span className={s.floor}>{z.toFixed(0)}층</span>}
        </div>
        {notice && <p className={s.notice}>{notice}</p>}
        {status === 'won' && <PlayResult />}
      </div>

      <div className={s.deck}>
        <VirtualJoystick onChange={onJoystick} />
        <p className={s.hint}>
          {mode === 'side'
            ? '← → 이동 · ↑ 점프 · Space 로 복귀'
            : '방향키 · WASD · 조이스틱으로 이동'}
        </p>
        <PlayMazeController />
      </div>
    </div>
  );
};
export default PlayMazeGame;
