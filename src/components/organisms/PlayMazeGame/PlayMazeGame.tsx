'use client';
import { FC, useEffect } from 'react';

import { useGameStore } from '@state/game/store';
import MazeBoard from '@components/molecules/MazeBoard';
import MazePlayer from '@components/atoms/MazePlayer';
import useResponsiveHeight from '@hooks/useResponsiveHeight';
import { MazeType, PointType } from '@type/maze';

import './PlayMazeGame.scss';

export interface PlayMazeGameProps {
  maze: MazeType;
}
const PlayMazeGame: FC<PlayMazeGameProps> = ({ maze }) => {
  const { mazeData, end, start, resolvedPath } = maze;
  const { elementRef, height } = useResponsiveHeight(0, 1, 1);
  const answer = useGameStore((state) => state.answer);
  const player = useGameStore((state) => state.player);
  const setPlayer = useGameStore((state) => state.setPlayer);
  const resetPlayer = useGameStore((state) => state.resetPlayer);
  const score = useGameStore((state) => state.score);
  const setScore = useGameStore((state) => state.setScore);
  const resetScore = useGameStore((state) => state.resetScore);

  const handlePlayer = (nextPlayer: PointType) => {
    if (
      nextPlayer.y < mazeData[0].length &&
      nextPlayer.x < mazeData.length &&
      nextPlayer.x >= 0 &&
      nextPlayer.y >= 0 &&
      mazeData[nextPlayer.x][nextPlayer.y] === 0
    ) {
      setPlayer(nextPlayer);
    }
  };

  const bindController = (e: KeyboardEvent) => {
    setScore((prev) => prev - 1);
    switch (e.code) {
      case 'ArrowLeft':
        handlePlayer({ ...player, y: player.y - 1 });
        break;
      case 'ArrowRight':
        handlePlayer({ ...player, y: player.y + 1 });
        break;
      case 'ArrowUp':
        handlePlayer({ ...player, x: player.x - 1 });
        break;
      case 'ArrowDown':
        handlePlayer({ ...player, x: player.x + 1 });
        break;
    }
  };

  useEffect(() => {
    if (player.x == end.x && player.y == end.y) {
      alert(`성공, ${score}점 획득하셨습니다.`);
      resetPlayer();
      resetScore();
    }
    window.addEventListener('keydown', bindController);
    return () => {
      window.removeEventListener('keydown', bindController);
    };
  }, [player]);

  useEffect(() => {
    resetPlayer();
    resetScore();
  }, []);

  return (
    <div className="maze-game" style={{ height: height }} ref={elementRef}>
      <MazeBoard
        mazeData={mazeData}
        start={start}
        end={end}
        height={height}
        resolvedPath={answer ? resolvedPath : []}
      />
      <MazePlayer
        player={player}
        playerSize={{
          width: height / mazeData[0].length,
          height: height / mazeData.length,
        }}
      />
    </div>
  );
};
export default PlayMazeGame;
