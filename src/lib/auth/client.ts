'use client';
import { createAuthClient } from '@neondatabase/auth/next';

// 클라이언트 인증 훅/메서드. NEXT_PUBLIC_NEON_AUTH_URL 을 자동으로 읽는다.
// useSession() / signIn.email() / signUp.email() / signOut() 제공.
export const authClient = createAuthClient();
