'use client';
import { FC } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';

import Button from '@components/atoms/Button';
import { answerState, playerState, scoreState } from '@state/game/atoms';

import './PlayMazeController.scss';

export interface PlayMazeControllerProps {}
const PlayMazeController: FC<PlayMazeControllerProps> = () => {
  const [answer, setAnswer] = useRecoilState(answerState);
  const resetPlayer = useResetRecoilState(playerState);
  const resetScore = useResetRecoilState(scoreState);

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
