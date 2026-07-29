'use client';
import { FC } from 'react';
import Link from 'next/link';

import { useGameStore } from '@state/game/store';
import { elapsedMs, computeStars, parMs } from '@game/mazeEngine';

import './PlayResult.scss';

function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  const cs = Math.floor((ms % 1000) / 10);
  return `${m}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

export interface PlayResultProps {}
const PlayResult: FC<PlayResultProps> = () => {
  const startedAt = useGameStore((s) => s.startedAt);
  const finishedAt = useGameStore((s) => s.finishedAt);
  const optimal = useGameStore((s) => s.optimal);
  const reset = useGameStore((s) => s.reset);

  const time = elapsedMs({ startedAt, finishedAt });
  const stars = computeStars(time, optimal);
  const par = parMs(optimal);

  return (
    <div className="play-result" role="dialog" aria-label="게임 결과">
      <div className="play-result-card">
        <p className="play-result-title">🎉 도착!</p>

        <div className="play-result-stars" aria-label={`별점 ${stars} / 3`}>
          {[1, 2, 3].map((i) => (
            <span key={i} className={i <= stars ? 'on' : ''}>
              ★
            </span>
          ))}
        </div>

        <dl className="play-result-stats">
          <div>
            <dt>시간</dt>
            <dd>{formatTime(time)}</dd>
          </div>
          <div>
            <dt>목표</dt>
            <dd>{par > 0 ? formatTime(par) : '-'}</dd>
          </div>
        </dl>

        <div className="play-result-actions">
          <button className="btn secondary" onClick={reset}>
            다시하기
          </button>
          <Link className="btn primary" href="/maplist">
            목록으로
          </Link>
        </div>
      </div>
    </div>
  );
};
export default PlayResult;
