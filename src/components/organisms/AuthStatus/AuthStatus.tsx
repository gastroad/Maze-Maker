'use client';
import { FC } from 'react';
import Link from 'next/link';

import { authClient } from '@lib/auth/client';

import * as s from './AuthStatus.css';

export interface AuthStatusProps {}
const AuthStatus: FC<AuthStatusProps> = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className={s.status} aria-hidden />;
  }

  if (!session?.user) {
    return (
      <div className={s.status}>
        <Link className={s.link} href="/auth/sign-in">
          로그인
        </Link>
      </div>
    );
  }

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.reload();
  };

  return (
    <div className={s.status}>
      <span className={s.user}>
        {session.user.name || session.user.email}
      </span>
      <button className={s.link} onClick={handleSignOut}>
        로그아웃
      </button>
    </div>
  );
};
export default AuthStatus;
