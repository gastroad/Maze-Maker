import { NextRequest, NextResponse } from 'next/server';
import { MazeType } from '@type/maze';
import { getMazes, createMaze } from '@server/service/mazeService';
import { auth } from '@server/auth/server';

export async function GET() {
  const mazes = await getMazes();
  return NextResponse.json({ status: 'success', results: mazes });
}

export async function POST(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json(
      { status: 'error', message: '로그인이 필요합니다.' },
      { status: 401 },
    );
  }

  const body: MazeType = await req.json();
  const newMaze = await createMaze(body, session.user.id);
  return NextResponse.json({ status: 'success', results: newMaze });
}
