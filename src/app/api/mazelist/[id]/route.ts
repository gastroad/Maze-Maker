import { NextRequest, NextResponse } from 'next/server';
import {
  getMazeById,
  deleteMaze,
  MazeOwnershipError,
} from '@server/service/mazeService';
import { auth } from '@server/auth/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const maze = await getMazeById(id);
  return NextResponse.json({ status: 'success', results: maze });
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json(
      { status: 'error', message: '로그인이 필요합니다.' },
      { status: 401 },
    );
  }

  try {
    await deleteMaze(id, session.user.id);
  } catch (err) {
    if (err instanceof MazeOwnershipError) {
      return NextResponse.json(
        { status: 'error', message: err.message },
        { status: 403 },
      );
    }
    throw err;
  }

  return NextResponse.json({ status: 'success', result: id });
}
