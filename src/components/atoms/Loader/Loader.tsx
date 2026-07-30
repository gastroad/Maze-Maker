import { FC } from 'react';

import * as s from './Loader.css';

export interface LoaderProps {
  label?: string;
}
const Loader: FC<LoaderProps> = ({ label = '불러오는 중…' }) => {
  return (
    <div className={s.wrap} role="status" aria-live="polite">
      <span className={s.spinner} aria-hidden />
      {label && <span>{label}</span>}
    </div>
  );
};
export default Loader;
