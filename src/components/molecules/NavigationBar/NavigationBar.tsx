import { FC, ReactElement } from 'react';

import { nav } from './NavigationBar.css';

export interface NavigationBarProps {
  children: ReactElement;
}
const NavigationBar: FC<NavigationBarProps> = ({ children }) => {
  return <nav className={nav}>{children}</nav>;
};
export default NavigationBar;
