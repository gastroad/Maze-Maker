import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import GameTemplate from '@components/templates/GameTemplate';
import PlayMazeGame from '@components/organisms/PlayMazeGame';
import PlayScoreBoard from '@components/organisms/PlayScoreBoard';
import PlayMazeController from '@components/organisms/PlayMazeController';
import { getMazeById } from '@server/service/mazeService';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const maze = await getMazeById(id);
  if (!maze) return { title: 'maze-maker' };
  return {
    title: `${maze.title}-${maze.name}`,
    description: `${maze.mazeSize.col} * ${maze.mazeSize.row} 미로를 플레이하실수 있습니다.`,
  };
}

export default async function MazePlayPage({ params }: PageProps) {
  const { id } = await params;
  const maze = await getMazeById(id);
  if (!maze) notFound();

  return (
    <GameTemplate title={maze.title} href="/maplist">
      <PlayScoreBoard />
      <PlayMazeGame maze={maze} />
      <PlayMazeController />
    </GameTemplate>
  );
}
