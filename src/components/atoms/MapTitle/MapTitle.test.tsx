import { render } from '@testing-library/react';
import MapTitle, { MapTitleProps } from './MapTitle';
import { title as titleClass } from './MapTitle.css';

describe('MapTitle', () => {
  const defaultProps: MapTitleProps = { title: 'test' };

  it('제목 텍스트를 렌더한다', () => {
    const { getByText } = render(<MapTitle {...defaultProps} />);
    const el = getByText('test');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass(titleClass);
  });
});
