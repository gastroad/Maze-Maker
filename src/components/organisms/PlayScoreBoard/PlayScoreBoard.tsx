'use client';
import { FC, useEffect, useState } from 'react';

import { useGameStore } from '@state/game/store';
import { elapsedMs, computeStars } from '@game/mazeEngine';
import { formatTime } from '@utils/formatTime';

import * as s from './PlayScoreBoard.css';

export interface PlayScoreBoardProps {}
const PlayScoreBoard: FC<PlayScoreBoardProps> = () => {
  const status = useGameStore((st) => st.status);
  const startedAt = useGameStore((st) => st.startedAt);
  const finishedAt = useGameStore((st) => st.finishedAt);
  const optimal = useGameStore((st) => st.optimal);

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
    <div className={s.board}>
      <div className={s.item}>
        <span className={s.label}>시간</span>
        <span className={s.value}>{formatTime(time)}</span>
      </div>
      <div className={s.item}>
        <span className={s.label}>별점</span>
        <span className={s.starRow} aria-label={`별점 ${stars} / 3`}>
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
