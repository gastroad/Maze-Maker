'use client';
import { FC, useEffect, useState } from 'react';

import { useGameStore } from '@state/game/store';
import { elapsedMs, computeStars } from '@game/mazeEngine';

import './PlayScoreBoard.scss';

function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  const cs = Math.floor((ms % 1000) / 10);
  return `${m}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

export interface PlayScoreBoardProps {}
const PlayScoreBoard: FC<PlayScoreBoardProps> = () => {
  const status = useGameStore((s) => s.status);
  const startedAt = useGameStore((s) => s.startedAt);
  const finishedAt = useGameStore((s) => s.finishedAt);
  const optimal = useGameStore((s) => s.optimal);

  // 진행 중에는 타이머/별점을 짧은 간격으로 다시 그린다.
  const [, forceTick] = useState(0);
  useEffect(() => {
    if (status !== 'playing') return;
    const id = setInterval(() => forceTick((t) => t + 1), 100);
    return () => clearInterval(id);
  }, [status]);

  const time = elapsedMs({ startedAt, finishedAt });
  const stars = computeStars(time, optimal);

  return (
    <div className="score-board">
      <div className="score-board-item">
        <span className="score-board-label">시간</span>
        <span className="score-board-value">{formatTime(time)}</span>
      </div>
      <div className="score-board-item">
        <span className="score-board-label">별점</span>
        <span
          className="score-board-stars"
          aria-label={`별점 ${stars} / 3`}
        >
          {[1, 2, 3].map((i) => (
            <span key={i} className={i <= stars ? 'on' : 'off'}>
              ★
            </span>
          ))}
        </span>
      </div>
    </div>
  );
};

export default PlayScoreBoard;
