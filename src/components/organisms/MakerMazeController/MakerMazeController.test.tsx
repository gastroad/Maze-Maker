import { render, fireEvent, waitFor } from '@testing-library/react';
import MakerMazeController from './MakerMazeController';
import { useMakerStore, HEIGHT_BRUSHES } from '@state/maker/store';

// vi.mock 은 파일 최상단으로 호이스팅되므로, 팩토리에서 참조할 값은 vi.hoisted 로 만든다.
const { mockPush } = vi.hoisted(() => ({ mockPush: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@api/maze', () => ({
  postMaze: vi.fn().mockResolvedValue({ status: 'success' }),
}));

describe('MakerMazeController', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('render MakerMazeController', () => {
    const { container, getAllByRole } = render(<MakerMazeController />);

    const buttonElements = getAllByRole('button');

    expect(container.firstElementChild).toBeInTheDocument();
    // 시작·종료 + 높이 브러시 5개 + 저장
    expect(buttonElements.length).toEqual(2 + HEIGHT_BRUSHES.length + 1);
  });

  it('지점 버튼을 누르면 브러시가 해당 지점으로 바뀐다', () => {
    const { getByText } = render(<MakerMazeController />);

    fireEvent.click(getByText('시작 지점'));
    expect(useMakerStore.getState().brush).toEqual({ kind: 'start' });

    fireEvent.click(getByText('종료 지점'));
    expect(useMakerStore.getState().brush).toEqual({ kind: 'end' });
  });

  it('높이 버튼을 누르면 그 높이로 칠하는 브러시가 된다', () => {
    const { getByText } = render(<MakerMazeController />);

    fireEvent.click(getByText('2 · 벽'));
    expect(useMakerStore.getState().brush).toEqual({
      kind: 'height',
      value: 2,
    });

    fireEvent.click(getByText('0 · 바닥'));
    expect(useMakerStore.getState().brush).toEqual({
      kind: 'height',
      value: 0,
    });
  });

  it('calls handleResolveButton', async () => {
    const { getByText } = render(<MakerMazeController />);
    const findAndSubmitButtonElement = getByText('저장하기');

    fireEvent.click(findAndSubmitButtonElement);
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
