import { Metadata } from 'next';

import GameTemplate from '@components/templates/GameTemplate';
import PlayMazeGame from '@components/organisms/PlayMazeGame';
import PlayScoreBoard from '@components/organisms/PlayScoreBoard';
import PlayMazeController from '@components/organisms/PlayMazeController';
import { getMaze } from '@api/maze';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { results: maze } = await getMaze(params.id);
  return {
    title: `${maze.title}-${maze.name}`,
    description: `${maze.mazeSize.col} * ${maze.mazeSize.row} 미로를 플레이하실수 있습니다.`,
  };
}

export default async function MazePlayPage({ params }: PageProps) {
  const { results: maze } = await getMaze(params.id);

  return (
    <GameTemplate title={maze.title} href="/maplist">
      <PlayScoreBoard />
      <PlayMazeGame maze={maze} />
      <PlayMazeController />
    </GameTemplate>
  );
}
