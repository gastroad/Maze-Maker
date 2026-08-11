'use client';
import { FC, useEffect, useRef } from 'react';

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

  const timeRef = useRef<HTMLSpanElement>(null);
  const starRowRef = useRef<HTMLSpanElement>(null);

  const time = elapsedMs({ startedAt, finishedAt });
  const stars = computeStars(time, optimal);

  // 진행 중에 바뀌는 것은 시간 텍스트와 별 세 개뿐이다. 100ms 간격으로 컴포넌트를
  // 다시 그리면 초당 10번의 리렌더가 그 두 곳을 위해 발생한다. 게임 루프와 같은
  // 방식으로 rAF 에서 DOM 을 직접 갱신한다 — 표시 정밀도(1/100초)는 그대로 두고
  // 갱신은 오히려 촘촘해지며, 탭이 숨겨지면 rAF 가 알아서 멈춘다.
  useEffect(() => {
    if (status !== 'playing') return;
    let raf = 0;
    let shownTime = '';
    let shownStars = -1;
    const tick = () => {
      const ms = elapsedMs({ startedAt, finishedAt: null });

      const text = formatTime(ms);
      if (text !== shownTime) {
        shownTime = text;
        if (timeRef.current) timeRef.current.textContent = text;
      }

      const next = computeStars(ms, optimal);
      if (next !== shownStars) {
        shownStars = next;
        const row = starRowRef.current;
        if (row) {
          row.setAttribute('aria-label', `별점 ${next} / 3`);
          for (let i = 0; i < row.children.length; i++) {
            row.children[i].className = i < next ? 'on' : 'off';
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [status, startedAt, optimal]);

  return (
    <div className={s.board}>
      <div className={s.item}>
        <span className={s.label}>시간</span>
        <span className={s.value} ref={timeRef}>
          {formatTime(time)}
        </span>
      </div>
      <div className={s.item}>
        <span className={s.label}>별점</span>
        <span
          className={s.starRow}
          ref={starRowRef}
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
