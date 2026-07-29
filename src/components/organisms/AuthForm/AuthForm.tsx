'use client';
import { FC, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import TextInputWithLabel from '@components/molecules/TextInputWithLabel';
import Button from '@components/atoms/Button';
import { authClient } from '@lib/auth/client';

import './AuthForm.scss';

type Mode = 'signin' | 'signup';

export interface AuthFormProps {}
const AuthForm: FC<AuthFormProps> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const changeMode = (next: Mode) => {
    setMode(next);
    setError('');
  };

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      const result =
        mode === 'signin'
          ? await authClient.signIn.email({ email, password })
          : await authClient.signUp.email({ email, password, name });
      if (result.error) {
        setError(result.error.message || '요청에 실패했습니다.');
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError('요청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-form-tabs">
        <Button
          type="primary"
          label="로그인"
          active={mode === 'signin'}
          onClick={() => changeMode('signin')}
        />
        <Button
          type="primary"
          label="회원가입"
          active={mode === 'signup'}
          onClick={() => changeMode('signup')}
        />
      </div>

      {mode === 'signup' && (
        <TextInputWithLabel
          value={name}
          type="text"
          name="name"
          placeholder="이름"
          onChange={(e) => setName(e.target.value)}
        />
      )}
      <TextInputWithLabel
        value={email}
        type="email"
        name="email"
        placeholder="이메일"
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextInputWithLabel
        value={password}
        type="password"
        name="password"
        placeholder="비밀번호"
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="auth-form-error">{error}</p>}

      <Button
        type="primary"
        label={loading ? '처리 중...' : mode === 'signin' ? '로그인' : '회원가입'}
        onClick={submit}
      />
    </div>
  );
};
export default AuthForm;
