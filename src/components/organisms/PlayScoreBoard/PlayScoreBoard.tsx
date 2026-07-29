'use client';
import { FC } from 'react';

import { useGameStore } from '@state/game/store';

import './PlayScoreBoard.scss';

export interface PlayScoreBoardProps {}
const PlayScoreBoard: FC<PlayScoreBoardProps> = () => {
  const score = useGameStore((state) => state.score);
  return (
    <div className="score-board">
      <span>score: {score}</span>
    </div>
  );
};

export default PlayScoreBoard;
