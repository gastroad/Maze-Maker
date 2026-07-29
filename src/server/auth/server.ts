import 'server-only';
import { createNeonAuth } from '@neondatabase/auth/next/server';

// Neon Auth(Managed Better Auth) 서버 인스턴스.
// 여기서만 세션을 읽고(auth.getSession) API 라우트를 처리(auth.handler)한다. — BE 전용
export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
});
