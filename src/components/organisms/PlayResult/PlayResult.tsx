'use client';
import { FC } from 'react';
import Link from 'next/link';

import { useGameStore } from '@state/game/store';
import { elapsedMs, computeStars, parMs } from '@game/mazeEngine';
import { button } from '@components/atoms/Button/Button.css';

import * as s from './PlayResult.css';

function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const sec = total % 60;
  const cs = Math.floor((ms % 1000) / 10);
  return `${m}:${String(sec).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

export interface PlayResultProps {}
const PlayResult: FC<PlayResultProps> = () => {
  const startedAt = useGameStore((st) => st.startedAt);
  const finishedAt = useGameStore((st) => st.finishedAt);
  const optimal = useGameStore((st) => st.optimal);
  const reset = useGameStore((st) => st.reset);

  const time = elapsedMs({ startedAt, finishedAt });
  const stars = computeStars(time, optimal);
  const par = parMs(optimal);

  return (
    <div className={s.result} role="dialog" aria-label="게임 결과">
      <div className={s.card}>
        <p className={s.title}>🎉 도착!</p>

        <div className={s.stars} aria-label={`별점 ${stars} / 3`}>
          {[1, 2, 3].map((i) => (
            <span key={i} className={i <= stars ? 'on' : ''}>
              ★
            </span>
          ))}
        </div>

        <dl className={s.stats}>
          <div>
            <dt>시간</dt>
            <dd>{formatTime(time)}</dd>
          </div>
          <div>
            <dt>목표</dt>
            <dd>{par > 0 ? formatTime(par) : '-'}</dd>
          </div>
        </dl>

        <div className={s.actions}>
          <button className={button({ variant: 'secondary' })} onClick={reset}>
            다시하기
          </button>
          <Link className={button({ variant: 'primary' })} href="/maplist">
            목록으로
          </Link>
        </div>
      </div>
    </div>
  );
};
export default PlayResult;
