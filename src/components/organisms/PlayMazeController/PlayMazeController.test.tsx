import { render, fireEvent } from '@testing-library/react';
import PlayMazeController from './PlayMazeController';

describe('PlayMazeController', () => {
  it('renders reset and answer buttons', () => {
    const { container, getByText } = render(<PlayMazeController />);

    expect(container.firstElementChild).toBeInTheDocument();
    expect(getByText('다시하기')).toBeInTheDocument();
    expect(getByText('정답 보기')).toBeInTheDocument();
  });

  it('toggles the answer button label when clicked', () => {
    const { getByText } = render(<PlayMazeController />);

    fireEvent.click(getByText('정답 보기'));
    expect(getByText('정답 숨기기')).toBeInTheDocument();
  });
});
