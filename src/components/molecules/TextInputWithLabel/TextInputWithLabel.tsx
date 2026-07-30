import { FC } from 'react';
import TextInput, { TextInputProps } from '@components/atoms/TextInput';

import * as s from './TextInputWithLabel.css';

export interface TextInputWithLabelProps extends TextInputProps {}
const TextInputWithLabel: FC<TextInputWithLabelProps> = (props) => {
  return (
    <div className={s.wrap}>
      <label className={s.label}>{props.placeholder}</label>
      <TextInput {...props} />
    </div>
  );
};
export default TextInputWithLabel;
