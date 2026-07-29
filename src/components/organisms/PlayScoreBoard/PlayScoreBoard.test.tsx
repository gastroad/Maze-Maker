import { render } from '@testing-library/react';
import PlayScoreBoard from './PlayScoreBoard';

describe('PlayScoreBoard', () => {
  it('시간·별점 라벨을 렌더한다', () => {
    const { container, getByText } = render(<PlayScoreBoard />);

    expect(container.querySelector('.score-board')).toBeInTheDocument();
    expect(getByText('시간')).toBeInTheDocument();
    expect(getByText('별점')).toBeInTheDocument();
    expect(container.querySelector('.score-board-stars')).toBeInTheDocument();
  });
});
