'use client';
import { FC, TouchEvent, useEffect, useRef } from 'react';

import { useGameStore } from '@state/game/store';
import { keyToDirection } from '@game/mazeEngine';
import MazeBoard from '@components/molecules/MazeBoard';
import MazePlayer from '@components/atoms/MazePlayer';
import PlayDpad from '@components/molecules/PlayDpad';
import PlayResult from '@components/organisms/PlayResult';
import useResponsiveHeight from '@hooks/useResponsiveHeight';
import { MazeType } from '@type/maze';

import './PlayMazeGame.scss';

const SWIPE_THRESHOLD = 28;

export interface PlayMazeGameProps {
  maze: MazeType;
}
const PlayMazeGame: FC<PlayMazeGameProps> = ({ maze }) => {
  const { mazeData, end, start, resolvedPath } = maze;
  const { elementRef, height } = useResponsiveHeight(0, 1, 1);

  const init = useGameStore((s) => s.init);
  const move = useGameStore((s) => s.move);
  const player = useGameStore((s) => s.game.player);
  const status = useGameStore((s) => s.game.status);
  const showAnswer = useGameStore((s) => s.showAnswer);

  // 미로가 준비되면 새 게임 시작
  useEffect(() => {
    init(maze);
  }, [maze, init]);

  // 키보드 입력 (방향키 + WASD) — 단일 리스너
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const dir = keyToDirection(e.key);
      if (dir) {
        e.preventDefault();
        move(dir);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [move]);

  // 스와이프 입력 (모바일)
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const from = touchStart.current;
    if (!from) return;
    touchStart.current = null;
    const t = e.changedTouches[0];
    const dx = t.clientX - from.x;
    const dy = t.clientY - from.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) return;
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'right' : 'left');
    else move(dy > 0 ? 'down' : 'up');
  };

  return (
    <div className="maze-game-wrap">
      <div
        className="maze-game"
        style={{ height }}
        ref={elementRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <MazeBoard
          mazeData={mazeData}
          start={start}
          end={end}
          height={height}
          resolvedPath={showAnswer ? resolvedPath : []}
        />
        <MazePlayer
          player={player}
          playerSize={{
            width: height / mazeData[0].length,
            height: height / mazeData.length,
          }}
        />
        {status === 'won' && <PlayResult />}
      </div>

      <PlayDpad onMove={move} />
    </div>
  );
};
export default PlayMazeGame;
