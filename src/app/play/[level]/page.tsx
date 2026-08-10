import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Cabinet from '@components/templates/Cabinet';
import HubWorld from '@components/organisms/HubWorld';
import { levelHub } from '@game/hubs';
import { getStagesByLevel } from '@server/service/mazeService';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ level: string }>;
}

function parseLevel(level: string): number | null {
  const n = Number(level);
  return Number.isInteger(n) && n >= 1 ? n : null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { level } = await params;
  const n = parseLevel(level);
  if (!n) return { title: 'maze-maker' };
  return {
    title: `레벨 ${n} · maze-maker`,
    description: `레벨 ${n} 의 스테이지를 골라 보세요.`,
  };
}

export default async function LevelHubPage({ params }: PageProps) {
  const { level } = await params;
  const n = parseLevel(level);
  if (!n) notFound();

  const stages = await getStagesByLevel(n);
  if (stages.length === 0) notFound();

  const hub = levelHub(
    n,
    stages.map((m) => m.stage!),
  );

  return (
    <Cabinet title={`레벨 ${n}`} back="/play" screenLabel={`Level ${n}`} wide>
      <HubWorld hub={hub} hint="스테이지 입구로 걸어가면 시작합니다." />
    </Cabinet>
  );
}
