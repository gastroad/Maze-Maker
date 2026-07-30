'use client';
import { FC, useCallback, useEffect, useRef } from 'react';

import { useGameStore } from '@state/game/store';
import { keyToDirection, PLAYER_HALF, type Input } from '@game/mazeEngine';
import useGameLoop, { BoardMetrics } from '@hooks/useGameLoop';
import MazeBoard from '@components/molecules/MazeBoard';
import MazePlayer from '@components/atoms/MazePlayer';
import VirtualJoystick from '@components/molecules/VirtualJoystick';
import PlayResult from '@components/organisms/PlayResult';
import useResponsiveHeight from '@hooks/useResponsiveHeight';
import { MazeType } from '@type/maze';

import * as s from './PlayMazeGame.css';

export interface PlayMazeGameProps {
  maze: MazeType;
}
const PlayMazeGame: FC<PlayMazeGameProps> = ({ maze }) => {
  const { mazeData, end, start, resolvedPath } = maze;
  const rows = mazeData.length;
  const cols = mazeData[0].length;

  const { elementRef, height } = useResponsiveHeight(0, 1, 1);

  const init = useGameStore((s) => s.init);
  const status = useGameStore((s) => s.status);
  const showAnswer = useGameStore((s) => s.showAnswer);

  const playerRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<BoardMetrics>({ side: height, rows, cols });
  metricsRef.current = { side: height, rows, cols };

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

  useGameLoop({ maze, playerRef, metricsRef, getInput });

  // 키보드 입력 (방향키 + WASD) — 누름/뗌으로 홀드 집합 유지
  useEffect(() => {
    const setKey = (key: string, down: boolean): boolean => {
      const dir = keyToDirection(key);
      if (!dir) return false;
      keysRef.current[dir] = down;
      return true;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (setKey(e.key, true)) e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => setKey(e.key, false);
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
  }, []);

  const onJoystick = useCallback((v: { x: number; y: number }) => {
    joyRef.current = v;
  }, []);

  const cellW = height / cols;
  const cellH = height / rows;
  const playerSize = Math.min(cellW, cellH) * PLAYER_HALF * 2;

  return (
    <div className={s.wrap}>
      <div className={s.game} style={{ height }} ref={elementRef}>
        <MazeBoard
          mazeData={mazeData}
          start={start}
          end={end}
          height={height}
          resolvedPath={showAnswer ? resolvedPath : []}
        />
        <MazePlayer ref={playerRef} size={playerSize} />
        {status === 'won' && <PlayResult />}
      </div>

      <VirtualJoystick onChange={onJoystick} />
    </div>
  );
};
export default PlayMazeGame;
