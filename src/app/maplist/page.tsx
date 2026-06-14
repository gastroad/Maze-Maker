import { Metadata } from 'next';
import GameTemplate from '@components/templates/GameTemplate';
import MazeList from '@components/organisms/MazeList';
import { getMazeList } from '@api/maze';

export async function generateMetadata(): Promise<Metadata> {
  const { results: mazeList } = await getMazeList();
  return {
    title: 'maze-maker-maplist',
    description: `${mazeList.length}개의 미로를 만나보실수 있습니다.`,
  };
}

export default async function Page() {
  const { results: mazeList } = await getMazeList();
  return (
    <GameTemplate title="Maze List" href="/">
      <MazeList mazeList={mazeList} />
    </GameTemplate>
  );
}
