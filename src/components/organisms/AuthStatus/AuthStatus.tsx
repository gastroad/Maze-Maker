'use client';
import { FC } from 'react';
import Link from 'next/link';

import { authClient } from '@lib/auth/client';

import './AuthStatus.scss';

export interface AuthStatusProps {}
const AuthStatus: FC<AuthStatusProps> = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="auth-status" aria-hidden />;
  }

  if (!session?.user) {
    return (
      <div className="auth-status">
        <Link className="auth-status-link" href="/auth/sign-in">
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
    <div className="auth-status">
      <span className="auth-status-user">
        {session.user.name || session.user.email}
      </span>
      <button className="auth-status-link" onClick={handleSignOut}>
        로그아웃
      </button>
    </div>
  );
};
export default AuthStatus;
