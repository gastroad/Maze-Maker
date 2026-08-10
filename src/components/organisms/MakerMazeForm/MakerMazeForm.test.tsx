import { render, fireEvent } from '@testing-library/react';
import MakerMazeForm, { MAX_SIZE, MIN_SIZE } from './MakerMazeForm';
import { useMakerStore } from '@state/maker/store';

describe('MakerMazeForm', () => {
  beforeEach(() => {
    useMakerStore.getState().reset();
  });

  it('4개의 입력 필드를 렌더한다', () => {
    const { container } = render(<MakerMazeForm />);

    expect(container.firstElementChild).toBeInTheDocument();
    expect(container.querySelectorAll('input')).toHaveLength(4);
  });

  it('제목·제작자는 입력 즉시 반영된다', () => {
    const { getByPlaceholderText } = render(<MakerMazeForm />);
    const title = getByPlaceholderText('맵 이름') as HTMLInputElement;
    const name = getByPlaceholderText('제작자 이름') as HTMLInputElement;

    fireEvent.change(title, { target: { value: 'test-title' } });
    expect(useMakerStore.getState().maze.title).toBe('test-title');

    fireEvent.change(name, { target: { value: 'test-name' } });
    expect(useMakerStore.getState().maze.name).toBe('test-name');
  });

  it('크기는 입력 중에는 확정되지 않고 blur 에서 확정된다', () => {
    const { getByPlaceholderText } = render(<MakerMazeForm />);
    const col = getByPlaceholderText(/미로 행/) as HTMLInputElement;
    const before = useMakerStore.getState().maze.mazeSize.col;

    // "10" 을 치는 도중의 "1" 로 판이 새로 만들어지면 안 된다
    fireEvent.change(col, { target: { value: '1' } });
    expect(useMakerStore.getState().maze.mazeSize.col).toBe(before);

    fireEvent.change(col, { target: { value: '10' } });
    expect(useMakerStore.getState().maze.mazeSize.col).toBe(before);

    fireEvent.blur(col);
    expect(useMakerStore.getState().maze.mazeSize.col).toBe(10);
  });

  it('앞에 0 이 붙은 값은 확정 시 정규화된다', () => {
    const { getByPlaceholderText } = render(<MakerMazeForm />);
    const col = getByPlaceholderText(/미로 행/) as HTMLInputElement;

    fireEvent.change(col, { target: { value: '007' } });
    fireEvent.blur(col);

    expect(col.value).toBe('7');
    expect(useMakerStore.getState().maze.mazeSize.col).toBe(7);
  });

  it('범위를 벗어난 값은 확정 시 상·하한으로 당겨진다', () => {
    const { getByPlaceholderText } = render(<MakerMazeForm />);
    const col = getByPlaceholderText(/미로 행/) as HTMLInputElement;
    const row = getByPlaceholderText(/미로 열/) as HTMLInputElement;

    fireEvent.change(col, { target: { value: '999' } });
    fireEvent.blur(col);
    expect(useMakerStore.getState().maze.mazeSize.col).toBe(MAX_SIZE);

    fireEvent.change(row, { target: { value: '0' } });
    fireEvent.blur(row);
    expect(useMakerStore.getState().maze.mazeSize.row).toBe(MIN_SIZE);
  });

  it('빈 값으로 두고 나가면 직전 값으로 되돌아간다', () => {
    const { getByPlaceholderText } = render(<MakerMazeForm />);
    const col = getByPlaceholderText(/미로 행/) as HTMLInputElement;
    const before = useMakerStore.getState().maze.mazeSize.col;

    fireEvent.change(col, { target: { value: '' } });
    fireEvent.blur(col);

    expect(col.value).toBe(String(before));
    expect(useMakerStore.getState().maze.mazeSize.col).toBe(before);
  });
});
