import type { FC, KeyboardEvent, ChangeEvent, FocusEvent } from 'react';

import { input } from './TextInput.css';

export interface TextInputProps {
  value: string | number;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  /** 값 확정 시점이 필요한 입력(숫자 등)에서 쓴다. */
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  type?: string;
  name?: string;
  min?: number;
  max?: number;
  inputMode?: 'numeric' | 'text';
}
const TextInput: FC<TextInputProps> = (props) => {
  return <input className={input} {...props} />;
};

export default TextInput;
