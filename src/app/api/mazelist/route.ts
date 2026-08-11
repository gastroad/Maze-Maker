import { NextRequest, NextResponse } from 'next/server';
import { createMaze } from '@server/service/mazeService';
import { parseMazeInput } from '@server/validation/mazeInput';
import { auth } from '@server/auth/server';

// GET 은 없다. 목록은 페이지가 서버 컴포넌트에서 @server/service 를 직접 부르고,
// 라우트로 열어 두면 인증 없이 공식 스테이지 전량과 각 미로의 userId 가 노출된다.

export async function POST(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json(
      { status: 'error', message: '로그인이 필요합니다.' },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { status: 'error', message: '요청 본문이 올바른 JSON 이 아닙니다.' },
      { status: 400 },
    );
  }

  const parsed = parseMazeInput(body);
  if (!parsed.ok) {
    return NextResponse.json(
      { status: 'error', message: parsed.message },
      { status: 400 },
    );
  }

  const newMaze = await createMaze(parsed.value, session.user.id);
  return NextResponse.json({ status: 'success', results: newMaze });
}
