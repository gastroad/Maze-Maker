import { render, fireEvent } from '@testing-library/react';
import MakerMazeForm from './MakerMazeForm';

describe('MakerMazeForm', () => {
  it('4개의 입력 필드를 렌더한다', () => {
    const { container } = render(<MakerMazeForm />);

    expect(container.firstElementChild).toBeInTheDocument();
    expect(container.querySelectorAll('input')).toHaveLength(4);
  });
  it('calls handleMaze', () => {
    const { getByPlaceholderText } = render(<MakerMazeForm />);
    const titleInputElement = getByPlaceholderText(
      '맵 이름',
    ) as HTMLInputElement;
    const nameInputElement = getByPlaceholderText(
      '제작자 이름',
    ) as HTMLInputElement;
    const colInputElement = getByPlaceholderText('미로 행') as HTMLInputElement;
    const rowInputElement = getByPlaceholderText('미로 열') as HTMLInputElement;

    fireEvent.change(titleInputElement, { target: { value: 'test-title' } });
    expect(titleInputElement.value).toEqual('test-title');

    fireEvent.change(nameInputElement, { target: { value: 'test-name' } });
    expect(nameInputElement.value).toEqual('test-name');

    fireEvent.change(colInputElement, { target: { value: '5' } });
    expect(colInputElement.value).toEqual('5');

    fireEvent.change(rowInputElement, { target: { value: '4' } });
    expect(rowInputElement.value).toEqual('4');
  });
});
