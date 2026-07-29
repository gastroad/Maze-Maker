import { Metadata } from 'next';
import GameTemplate from '@components/templates/GameTemplate';
import MazeList from '@components/organisms/MazeList';
import { getMazes } from '@server/service/mazeService';
import { auth } from '@server/auth/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const mazeList = await getMazes();
  return {
    title: 'maze-maker-maplist',
    description: `${mazeList.length}개의 미로를 만나보실수 있습니다.`,
  };
}

export default async function Page() {
  const [mazeList, { data: session }] = await Promise.all([
    getMazes(),
    auth.getSession(),
  ]);
  return (
    <GameTemplate title="Maze List" href="/">
      <MazeList mazeList={mazeList} currentUserId={session?.user?.id} />
    </GameTemplate>
  );
}
