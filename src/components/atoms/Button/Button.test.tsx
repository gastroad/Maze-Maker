import { render, fireEvent } from '@testing-library/react';
import Button, { ButtonProps } from './Button';

describe('Button', () => {
  const onClick = vi.fn();
  const base: ButtonProps = { onClick, label: 'Click', type: 'primary' };

  beforeEach(() => onClick.mockClear());

  it('라벨을 버튼으로 렌더한다', () => {
    const { getByRole } = render(<Button {...base} />);
    expect(getByRole('button', { name: 'Click' })).toBeInTheDocument();
  });

  it.each(['primary', 'secondary', 'tertiary'] as const)(
    '%s 타입을 렌더한다',
    (type: ButtonProps['type']) => {
      const { getByText } = render(<Button {...base} type={type} />);
      expect(getByText('Click')).toBeInTheDocument();
    },
  );

  it('name 속성을 전달한다', () => {
    const { getByRole } = render(<Button {...base} name="submit" />);
    expect(getByRole('button')).toHaveAttribute('name', 'submit');
  });

  it('클릭 시 onClick 을 호출한다', () => {
    const { getByText } = render(<Button {...base} />);
    fireEvent.click(getByText('Click'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
