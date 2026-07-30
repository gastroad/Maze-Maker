import { render, fireEvent, waitFor } from '@testing-library/react';
import MakerMazeController from './MakerMazeController';
import { useMakerStore } from '@state/maker/store';

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
    expect(buttonElements.length).toEqual(5);
  });

  it('타입 버튼 클릭 시 currentType 이 해당 타입으로 바뀐다', () => {
    const { getByText } = render(<MakerMazeController />);

    fireEvent.click(getByText('시작 지점'));
    expect(useMakerStore.getState().currentType).toBe('start');

    fireEvent.click(getByText('종료 지점'));
    expect(useMakerStore.getState().currentType).toBe('end');

    fireEvent.click(getByText('벽(이동 불가)'));
    expect(useMakerStore.getState().currentType).toBe('wall');

    fireEvent.click(getByText('길(이동 가능)'));
    expect(useMakerStore.getState().currentType).toBe('road');
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
