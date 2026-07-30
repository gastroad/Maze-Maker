import { redirect } from 'next/navigation';

import Cabinet from '@components/templates/Cabinet';
import MakerMazeMaker from '@components/organisms/MakerMazeMaker';
import MakerMazeForm from '@components/organisms/MakerMazeForm';
import MakerMazeController from '@components/organisms/MakerMazeController';
import { auth } from '@server/auth/server';

import * as s from './page.css';

// 세션(쿠키) 기반 접근 제어 — 정적 프리렌더 대신 요청 시 렌더.
export const dynamic = 'force-dynamic';

export default async function Maker() {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    redirect('/auth/sign-in?redirect=/maker');
  }

  return (
    <Cabinet title="Maker" back="/" screenLabel="Build Mode" wide>
      <MakerMazeForm />
      <div className={s.body}>
        <MakerMazeMaker />
        <MakerMazeController />
      </div>
    </Cabinet>
  );
}
