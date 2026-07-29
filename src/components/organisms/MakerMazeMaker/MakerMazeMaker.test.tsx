import React from 'react';
import { render } from '@testing-library/react';
import MakerMazeMaker from './MakerMazeMaker';

describe('MakerMazeMaker', () => {
  it('render MakerMazeMaker', () => {
    // TODO maze-cell select 해서 handlecellclick 추가하기
    const { container } = render(<MakerMazeMaker />);

    const mazeMakerElement = container.querySelector('.maze-maker');
    expect(mazeMakerElement).toBeInTheDocument();
  });
});
