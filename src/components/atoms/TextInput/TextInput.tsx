import type { FC, KeyboardEvent, ChangeEvent } from 'react';

import { input } from './TextInput.css';

export interface TextInputProps {
  value: string | number;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  type?: string;
  name?: string;
}
const TextInput: FC<TextInputProps> = (props) => {
  return <input className={input} {...props} />;
};

export default TextInput;
