import { createRef } from 'react';
import { render } from '@testing-library/react';
import MazePlayer from './MazePlayer';

describe('MazePlayer', () => {
  it('지정한 크기로 렌더된다', () => {
    const { container } = render(<MazePlayer size={100} />);
    const el = container.querySelector('.maze-player') as HTMLElement;
    expect(el).toBeInTheDocument();
    expect(container.querySelector('img')).toBeInTheDocument();

    const style = getComputedStyle(el);
    expect(style.width).toBe('100px');
    expect(style.height).toBe('100px');
  });

  it('ref 가 .maze-player 엘리먼트로 전달된다', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<MazePlayer ref={ref} size={80} />);
    expect(ref.current).toBe(container.querySelector('.maze-player'));
  });
});
