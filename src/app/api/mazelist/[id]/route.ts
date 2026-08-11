import { NextRequest, NextResponse } from 'next/server';
import { deleteMaze, MazeOwnershipError } from '@server/service/mazeService';
import { auth } from '@server/auth/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET 은 없다. 상세 페이지가 서버 컴포넌트에서 getMazeById 를 직접 부르므로
// 호출부가 없었고, 인증 없이 미로의 userId 까지 그대로 내주고 있었다.

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
