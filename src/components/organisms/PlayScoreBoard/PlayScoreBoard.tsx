'use client';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { scoreState } from '@state/game/atoms';

import './PlayScoreBoard.scss';

export interface PlayScoreBoardProps {}
const PlayScoreBoard: FC<PlayScoreBoardProps> = () => {
  const score = useRecoilValue(scoreState);
  return (
    <div className="score-board">
      <span>score: {score}</span>
    </div>
  );
};

export default PlayScoreBoard;
