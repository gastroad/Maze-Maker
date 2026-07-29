import React from 'react';
import { render } from '@testing-library/react';
import PlayScoreBoard from './PlayScoreBoard';

describe('PlayScoreBoard', () => {
  it('render PlayScoreBoard', () => {
    const { container } = render(<PlayScoreBoard />);

    const scoreBoardElement = container.querySelector('.score-board');
    expect(scoreBoardElement).toBeInTheDocument();
  });

  it('should display the correct score', () => {
    const { getByText } = render(<PlayScoreBoard />);

    const scoreTextElement = getByText(`score: ${0}`);
    expect(scoreTextElement).toBeInTheDocument();
  });
});
