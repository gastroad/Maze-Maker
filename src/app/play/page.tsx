import { Metadata } from 'next';

import Cabinet from '@components/templates/Cabinet';
import HubWorld from '@components/organisms/HubWorld';
import { mainHub } from '@game/hubs';
import { getStages } from '@server/service/mazeService';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'maze-maker',
  description: '레벨을 골라 스테이지에 도전해 보세요.',
};

export default async function PlayHubPage() {
  // 실제로 존재하는 레벨만 입구를 낸다(스테이지를 더 넣으면 자동으로 늘어난다).
  const stages = await getStages();
  const levels = [...new Set(stages.map((m) => m.level!))].sort((a, b) => a - b);
  const hub = mainHub(levels.length);

  return (
    <Cabinet title="Play" back="/" screenLabel="Hub" wide>
      <HubWorld hub={hub} hint="입구로 걸어가면 들어갑니다 · 방향키 · WASD" />
    </Cabinet>
  );
}
