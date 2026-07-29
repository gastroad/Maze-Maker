'use client';
import { FC } from 'react';

import Button from '@components/atoms/Button';
import { useGameStore } from '@state/game/store';

import './PlayMazeController.scss';

export interface PlayMazeControllerProps {}
const PlayMazeController: FC<PlayMazeControllerProps> = () => {
  const answer = useGameStore((state) => state.answer);
  const setAnswer = useGameStore((state) => state.setAnswer);
  const resetPlayer = useGameStore((state) => state.resetPlayer);
  const resetScore = useGameStore((state) => state.resetScore);

  const resetPlayerAndScore = () => {
    resetPlayer();
    resetScore();
    setAnswer(false);
  };

  const handleResolveButton = () => {
    setAnswer(!answer);
  };

  const handleResetButton = () => {
    resetPlayerAndScore();
  };

  return (
    <div className="play-maze-controller">
      <Button onClick={handleResetButton} label="Reset" type="primary" />
      <Button onClick={handleResolveButton} label="정답보기" type="primary" />
    </div>
  );
};
export default PlayMazeController;
