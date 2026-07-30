import { render, fireEvent } from '@testing-library/react';
import TextInput, { TextInputProps } from './TextInput';

describe('TextInput', () => {
  const onKeyDown = vi.fn();
  const onChange = vi.fn();
  const placeholder = 'Enter text';
  const value = '';
  const type = 'text';
  const name = 'test';

  const defaultProps: TextInputProps = {
    value: value,
    placeholder: placeholder,
    onChange: onChange,
    onKeyDown: onKeyDown,
    type,
    name,
  };

  it('render TextInput', () => {
    const { getByPlaceholderText } = render(<TextInput {...defaultProps} />);
    const input = getByPlaceholderText(placeholder);

    expect(input).toBeInTheDocument();
  });

  it('calls onChange', () => {
    const { getByPlaceholderText } = render(<TextInput {...defaultProps} />);
    const input = getByPlaceholderText(placeholder);
    fireEvent.change(input, { target: { value: 'Hello, World!' } });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it('calls onKeyDown', () => {
    const { getByPlaceholderText } = render(<TextInput {...defaultProps} />);
    const input = getByPlaceholderText(placeholder);
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(onKeyDown).toHaveBeenCalledWith(expect.any(Object));
  });
});
