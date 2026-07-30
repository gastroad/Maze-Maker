import { FC, ReactNode } from 'react';

import { home } from './HomeTemplate.css';

export interface HomeTemplateProps {
  children: ReactNode;
}
const HomeTemplate: FC<HomeTemplateProps> = ({ children }) => {
  return <div className={home}>{children}</div>;
};

export default HomeTemplate;
