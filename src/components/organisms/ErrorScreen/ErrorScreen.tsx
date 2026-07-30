'use client';
import { FC } from 'react';

import Cabinet from '@components/templates/Cabinet';
import Button from '@components/atoms/Button';

import * as s from './ErrorScreen.css';

export interface ErrorScreenProps {
  reset: () => void;
  message?: string;
  back?: string;
}
const ErrorScreen: FC<ErrorScreenProps> = ({
  reset,
  message = '문제가 발생했어요. 잠시 후 다시 시도해 주세요.',
  back = '/',
}) => {
  return (
    <Cabinet back={back} screenLabel="Error">
      <div className={s.wrap}>
        <span className={s.icon} aria-hidden>
          ⚠
        </span>
        <p className={s.msg}>{message}</p>
        <Button type="primary" label="다시 시도" onClick={reset} />
      </div>
    </Cabinet>
  );
};
export default ErrorScreen;
