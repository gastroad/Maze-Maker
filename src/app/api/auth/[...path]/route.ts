import { auth } from '@server/auth/server';

// Neon Auth 클라이언트 요청(sign-in/up/out, 세션 조회)을 처리하는 프록시 핸들러.
export const { GET, POST } = auth.handler();
