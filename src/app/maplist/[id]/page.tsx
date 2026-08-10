import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Cabinet from '@components/templates/Cabinet';
import PlayMazeGame from '@components/organisms/PlayMazeGame';
import PlayScoreBoard from '@components/organisms/PlayScoreBoard';
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
    // 표시는 목록 카드와 같은 순서(가로 × 세로)로 맞춘다
    description: `${maze.mazeSize.cols} × ${maze.mazeSize.rows} 미로를 플레이하실수 있습니다.`,
  };
}

export default async function MazePlayPage({ params }: PageProps) {
  const { id } = await params;
  const maze = await getMazeById(id);
  if (!maze) notFound();

  return (
    <Cabinet
      title={maze.title}
      back="/maplist"
      hud={<PlayScoreBoard />}
      wide
    >
      <PlayMazeGame maze={maze} />
    </Cabinet>
  );
}
