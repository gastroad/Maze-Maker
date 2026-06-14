import { FC } from 'react';
import TextInput, {
  TextInputProps,
} from '@components/atoms/TextInput';

import './TextInputWithLabel.scss';

export interface TextInputWithLabelProps extends TextInputProps {}
const TextInputWithLabel: FC<TextInputWithLabelProps> = (props) => {
  return (
    <div className="input-txt-label">
      <label>{props.placeholder}</label>
      <TextInput {...props} />
    </div>
  );
};
export default TextInputWithLabel;
