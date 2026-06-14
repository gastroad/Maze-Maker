import fs from 'fs';
import path from 'path';
import { MazeType } from '@type/maze';

const dataFilePath = path.join(
  process.cwd(),
  'src/app/api/mazelist',
  'data.json',
);

export function loadMazes(): MazeType[] {
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
}

export function saveMazes(mazes: MazeType[]): void {
  fs.writeFileSync(dataFilePath, JSON.stringify(mazes));
}

export function getMazeById(id: MazeType['id']): MazeType | undefined {
  return loadMazes().find((maze) => maze.id === id);
}
