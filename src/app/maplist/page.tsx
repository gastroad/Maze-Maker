import { Metadata } from 'next';
import GameTemplate from '@components/templates/GameTemplate';
import MazeList from '@components/organisms/MazeList';
import { loadMazes } from '@server/mazeStore';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const mazeList = loadMazes();
  return {
    title: 'maze-maker-maplist',
    description: `${mazeList.length}개의 미로를 만나보실수 있습니다.`,
  };
}

export default function Page() {
  const mazeList = loadMazes();
  return (
    <GameTemplate title="Maze List" href="/">
      <MazeList mazeList={mazeList} />
    </GameTemplate>
  );
}
