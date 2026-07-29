import React from 'react';
import { render } from '@testing-library/react';
import PlayScoreBoard from './PlayScoreBoard';

describe('PlayScoreBoard', () => {
  it('renders the HUD with move and time labels', () => {
    const { container, getByText } = render(<PlayScoreBoard />);

    expect(container.querySelector('.score-board')).toBeInTheDocument();
    expect(getByText('이동')).toBeInTheDocument();
    expect(getByText('시간')).toBeInTheDocument();
  });
});
