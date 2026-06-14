import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import GameTemplate from '@components/templates/GameTemplate';
import PlayMazeGame from '@components/organisms/PlayMazeGame';
import PlayScoreBoard from '@components/organisms/PlayScoreBoard';
import PlayMazeController from '@components/organisms/PlayMazeController';
import { getMazeById } from '@server/mazeStore';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const maze = getMazeById(params.id);
  if (!maze) return { title: 'maze-maker' };
  return {
    title: `${maze.title}-${maze.name}`,
    description: `${maze.mazeSize.col} * ${maze.mazeSize.row} 미로를 플레이하실수 있습니다.`,
  };
}

export default function MazePlayPage({ params }: PageProps) {
  const maze = getMazeById(params.id);
  if (!maze) notFound();

  return (
    <GameTemplate title={maze.title} href="/maplist">
      <PlayScoreBoard />
      <PlayMazeGame maze={maze} />
      <PlayMazeController />
    </GameTemplate>
  );
}
