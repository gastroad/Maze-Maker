import { useMakerStore } from './store';
import { ABSOLUTE_WALL } from '@type/maze';

describe('maker store', () => {
  beforeEach(() => {
    useMakerStore.getState().reset();
  });

  it('높이 브러시로 칠하면 그 칸만 값이 바뀐다', () => {
    const { setBrush, paint } = useMakerStore.getState();
    setBrush({ kind: 'height', value: 2 });
    paint(1, 1);

    const { mazeData } = useMakerStore.getState();
    expect(mazeData[1][1]).toBe(2);
    expect(mazeData[0][0]).toBe(0);
  });

  it('바뀌지 않는 칸을 칠하면 상태 객체를 새로 만들지 않는다', () => {
    const { setBrush, paint } = useMakerStore.getState();
    setBrush({ kind: 'height', value: 2 });
    paint(1, 1);

    const before = useMakerStore.getState().mazeData;
    paint(1, 1); // 같은 값 — 드래그 중 매 프레임 일어나는 상황
    expect(useMakerStore.getState().mazeData).toBe(before);
  });

  it('칠할 때 바뀐 행만 새로 만든다', () => {
    const { setBrush, paint } = useMakerStore.getState();
    const before = useMakerStore.getState().mazeData;
    setBrush({ kind: 'height', value: ABSOLUTE_WALL });
    paint(2, 3);

    const after = useMakerStore.getState().mazeData;
    expect(after).not.toBe(before);
    expect(after[2]).not.toBe(before[2]); // 바뀐 행은 새 배열
    expect(after[0]).toBe(before[0]); // 나머지 행은 그대로 재사용
  });

  it('시작·종료 브러시는 높이를 건드리지 않고 지점만 옮긴다', () => {
    const { setBrush, paint } = useMakerStore.getState();
    const before = useMakerStore.getState().mazeData;

    setBrush({ kind: 'start' });
    paint(2, 2);
    expect(useMakerStore.getState().startEnd.start).toEqual({ x: 2, y: 2 });

    setBrush({ kind: 'end' });
    paint(3, 3);
    expect(useMakerStore.getState().startEnd.end).toEqual({ x: 3, y: 3 });

    expect(useMakerStore.getState().mazeData).toBe(before);
  });

  it('판 밖 좌표는 무시한다', () => {
    const { setBrush, paint } = useMakerStore.getState();
    const before = useMakerStore.getState().mazeData;
    setBrush({ kind: 'height', value: 2 });

    paint(-1, 0);
    paint(0, 999);
    expect(useMakerStore.getState().mazeData).toBe(before);
  });
});
