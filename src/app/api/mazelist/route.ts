import { NextRequest, NextResponse } from 'next/server';
import { v4 } from 'uuid';
import { MazeType } from '@type/maze';
import { loadMazes, saveMazes } from '@server/mazeStore';

export async function GET() {
  const mazes = loadMazes();
  return NextResponse.json({ status: 'success', results: mazes });
}

export async function POST(req: NextRequest) {
  const body: MazeType = await req.json();
  const mazes = loadMazes();
  const newMaze: MazeType = { ...body, id: v4() };
  mazes.push(newMaze);
  saveMazes(mazes);
  return NextResponse.json({ status: 'success', results: newMaze });
}
