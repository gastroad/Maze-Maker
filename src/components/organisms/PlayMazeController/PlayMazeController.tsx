'use client';
import { FC } from 'react';

import Button from '@components/atoms/Button';
import { useGameStore } from '@state/game/store';

import { controller } from './PlayMazeController.css';

export interface PlayMazeControllerProps {}
const PlayMazeController: FC<PlayMazeControllerProps> = () => {
  const reset = useGameStore((state) => state.reset);
  const toggleAnswer = useGameStore((state) => state.toggleAnswer);
  const showAnswer = useGameStore((state) => state.showAnswer);

  return (
    <div className={controller}>
      <Button onClick={reset} label="다시하기" type="secondary" />
      <Button
        onClick={toggleAnswer}
        label={showAnswer ? '정답 숨기기' : '정답 보기'}
        type="primary"
        active={showAnswer}
      />
    </div>
  );
};
export default PlayMazeController;
