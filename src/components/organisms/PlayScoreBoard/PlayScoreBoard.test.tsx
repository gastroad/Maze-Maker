import { render } from '@testing-library/react';
import PlayScoreBoard from './PlayScoreBoard';
import { starRow } from './PlayScoreBoard.css';

describe('PlayScoreBoard', () => {
  it('시간·별점 라벨을 렌더한다', () => {
    const { container, getByText } = render(<PlayScoreBoard />);

    expect(container.firstElementChild).toBeInTheDocument();
    expect(getByText('시간')).toBeInTheDocument();
    expect(getByText('별점')).toBeInTheDocument();
    expect(container.querySelector('.' + starRow)).toBeInTheDocument();
  });
});
