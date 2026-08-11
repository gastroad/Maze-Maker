import { MAX_SIZE } from '@type/maze';

import { parseMazeInput } from './mazeInput';

const valid = () => ({
  title: '테스트 미로',
  name: '만든이',
  mazeData: [
    [0, 0, 0],
    [0, 2, 0],
    [9, 0, 0],
  ],
  start: { x: 0, y: 0 },
  end: { x: 2, y: 2 },
});

describe('parseMazeInput', () => {
  it('올바른 본문은 통과시킨다', () => {
    const result = parseMazeInput(valid());
    expect(result.ok).toBe(true);
  });

  it('mazeSize 는 결과에 담지 않는다 — 크기의 원천은 mazeData 다', () => {
    const result = parseMazeInput({
      ...valid(),
      mazeSize: { rows: 99, cols: 1 },
    });
    expect(result.ok).toBe(true);
    expect(result).not.toHaveProperty('value.mazeSize');
  });

  it.each([
    ['본문이 객체가 아님', null],
    ['제목 없음', { ...valid(), title: '' }],
    ['제목이 문자열이 아님', { ...valid(), title: 123 }],
    ['제목이 너무 김', { ...valid(), title: 'a'.repeat(61) }],
    ['만든 사람이 너무 김', { ...valid(), name: 'a'.repeat(41) }],
    ['mazeData 없음', { ...valid(), mazeData: undefined }],
    ['행이 너무 적음', { ...valid(), mazeData: [[0, 0, 0]] }],
    [
      '행 길이가 들쭉날쭉',
      {
        ...valid(),
        mazeData: [
          [0, 0, 0],
          [0, 0],
          [0, 0, 0],
        ],
      },
    ],
    [
      '허용되지 않은 높이',
      {
        ...valid(),
        mazeData: [
          [0, 0, 0],
          [0, 4, 0],
          [0, 0, 0],
        ],
      },
    ],
    [
      '정수가 아닌 칸',
      {
        ...valid(),
        mazeData: [
          [0, 0, 0],
          [0, 1.5, 0],
          [0, 0, 0],
        ],
      },
    ],
    ['시작점이 판 밖', { ...valid(), start: { x: 3, y: 0 } }],
    ['도착점이 음수', { ...valid(), end: { x: -1, y: 0 } }],
    ['좌표가 정수가 아님', { ...valid(), start: { x: 0.5, y: 0 } }],
    ['최적 경로가 배열이 아님', { ...valid(), resolvedPath: 3 }],
    ['최적 경로의 점이 판 밖', { ...valid(), resolvedPath: [{ x: 9, y: 9 }] }],
  ])('%s → 400', (_label, body) => {
    const result = parseMazeInput(body);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).not.toBe('');
  });

  it('크기 상한을 넘으면 거부한다', () => {
    const oversized = Array.from({ length: MAX_SIZE + 1 }, () =>
      Array.from({ length: 3 }, () => 0),
    );
    const result = parseMazeInput({ ...valid(), mazeData: oversized });
    expect(result.ok).toBe(false);
  });

  it('제목과 만든 사람의 공백을 다듬는다', () => {
    const result = parseMazeInput({ ...valid(), title: '  미로  ' });
    expect(result.ok && result.value.title).toBe('미로');
  });
});
