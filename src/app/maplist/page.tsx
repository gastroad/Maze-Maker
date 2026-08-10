import { Metadata } from 'next';
import Cabinet from '@components/templates/Cabinet';
import MazeList from '@components/organisms/MazeList';
import { getUserMazes } from '@server/service/mazeService';
import { auth } from '@server/auth/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const mazeList = await getUserMazes();
  return {
    title: '유저 미로 · maze-maker',
    description: `유저가 만든 미로 ${mazeList.length}개를 만나보실수 있습니다.`,
  };
}

export default async function Page() {
  const [mazeList, { data: session }] = await Promise.all([
    getUserMazes(),
    auth.getSession(),
  ]);
  return (
    <Cabinet title="유저 미로" back="/play" screenLabel="User Maps" wide>
      <MazeList mazeList={mazeList} currentUserId={session?.user?.id} />
    </Cabinet>
  );
}
