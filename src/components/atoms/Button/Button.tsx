import { FC, MouseEvent } from 'react';

import { button } from './Button.css';

export interface ButtonProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  label: string;
  type: 'primary' | 'secondary' | 'tertiary';
  active?: boolean;
  name?: string;
}
const Button: FC<ButtonProps> = ({
  onClick,
  label,
  type,
  active = false,
  name = '',
}) => {
  return (
    <button
      className={button({ variant: type, active })}
      onClick={onClick}
      name={name}
    >
      {label}
    </button>
  );
};
export default Button;
