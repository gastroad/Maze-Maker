import { Suspense } from 'react';
import Cabinet from '@components/templates/Cabinet';
import AuthForm from '@components/organisms/AuthForm';

export const metadata = {
  title: 'maze-maker-login',
  description: '로그인하고 나만의 미로를 만들어보세요.',
};

export default function SignInPage() {
  return (
    <Cabinet title="로그인" back="/" screenLabel="Sign In">
      {/* useSearchParams 사용을 위한 Suspense 경계 */}
      <Suspense>
        <AuthForm />
      </Suspense>
    </Cabinet>
  );
}
