import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Cabinet from '@components/templates/Cabinet';
import PlayMazeGame from '@components/organisms/PlayMazeGame';
import PlayScoreBoard from '@components/organisms/PlayScoreBoard';
import { getStage } from '@server/service/mazeService';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ level: string; stage: string }>;
}

/** 주소의 숫자를 검증한다. 범위를 벗어나면 404. */
function parseCoords(level: string, stage: string) {
  const l = Number(level);
  const s = Number(stage);
  if (!Number.isInteger(l) || !Number.isInteger(s)) return null;
  if (l < 1 || s < 1) return null;
  return { level: l, stage: s };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { level, stage } = await params;
  const coords = parseCoords(level, stage);
  if (!coords) return { title: 'maze-maker' };
  const maze = await getStage(coords.level, coords.stage);
  if (!maze) return { title: 'maze-maker' };
  return {
    title: `${maze.title} · maze-maker`,
    description: `${maze.mazeSize.cols} × ${maze.mazeSize.rows} 스테이지에 도전해 보세요.`,
  };
}

export default async function StagePlayPage({ params }: PageProps) {
  const { level, stage } = await params;
  const coords = parseCoords(level, stage);
  if (!coords) notFound();

  const maze = await getStage(coords.level, coords.stage);
  if (!maze) notFound();

  return (
    <Cabinet
      title={maze.title}
      back={`/play/${coords.level}`}
      hud={<PlayScoreBoard />}
      wide
    >
      <PlayMazeGame maze={maze} />
    </Cabinet>
  );
}
