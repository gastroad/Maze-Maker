import { render } from '@testing-library/react';
import MakerMazeMaker from './MakerMazeMaker';

describe('MakerMazeMaker', () => {
  it('보드 컨테이너를 렌더한다', () => {
    const { container } = render(<MakerMazeMaker />);
    expect(container.firstElementChild).toBeInTheDocument();
  });
});
