import { NextRequest, NextResponse } from 'next/server';
import { loadMazes, saveMazes } from '@server/mazeStore';

interface RouteContext {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const maze = loadMazes().find((maze) => maze.id === params.id);
  return NextResponse.json({ status: 'success', results: maze });
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const mazes = loadMazes().filter((maze) => maze.id !== params.id);
  saveMazes(mazes);
  return NextResponse.json({ status: 'success', result: params.id });
}
