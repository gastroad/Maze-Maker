'use client';
import { FC, useEffect, useState } from 'react';

import { useGameStore } from '@state/game/store';
import { elapsedMs } from '@game/mazeEngine';

import './PlayScoreBoard.scss';

function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export interface PlayScoreBoardProps {}
const PlayScoreBoard: FC<PlayScoreBoardProps> = () => {
  const moves = useGameStore((s) => s.game.moves);
  const optimal = useGameStore((s) => s.optimal);
  const status = useGameStore((s) => s.game.status);
  const game = useGameStore((s) => s.game);

  // 진행 중에는 타이머를 주기적으로 다시 그린다.
  const [, forceTick] = useState(0);
  useEffect(() => {
    if (status !== 'playing') return;
    const id = setInterval(() => forceTick((t) => t + 1), 250);
    return () => clearInterval(id);
  }, [status]);

  return (
    <div className="score-board">
      <div className="score-board-item">
        <span className="score-board-label">이동</span>
        <span className="score-board-value">
          {moves}
          <em>/ {optimal || '-'}</em>
        </span>
      </div>
      <div className="score-board-item">
        <span className="score-board-label">시간</span>
        <span className="score-board-value">{formatTime(elapsedMs(game))}</span>
      </div>
    </div>
  );
};

export default PlayScoreBoard;
