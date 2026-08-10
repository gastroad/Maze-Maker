import { ABSOLUTE_WALL, type MazeDataType } from '@type/maze';
import { findPath } from '@utils/findPath';

import { generateMaze, reachableFrom } from './mazeGenerator';

/** 미로 전체를 훑어 height 인 칸의 좌표를 모은다. */
function cellsOfHeight(
  mazeData: MazeDataType,
  height: number,
): Array<[number, number]> {
  const found: Array<[number, number]> = [];
  for (let r = 0; r < mazeData.length; r++) {
    for (let c = 0; c < mazeData[r].length; c++) {
      if (mazeData[r][c] === height) found.push([r, c]);
    }
  }
  return found;
}

/** 상하 또는 좌우가 모두 통로(0)인가 — 턱의 성립 조건. */
function isBridgeCell(mazeData: MazeDataType, r: number, c: number): boolean {
  const at = (rr: number, cc: number) => mazeData[rr]?.[cc];
  return (
    (at(r - 1, c) === 0 && at(r + 1, c) === 0) ||
    (at(r, c - 1) === 0 && at(r, c + 1) === 0)
  );
}

describe('generateMaze', () => {
  it('같은 시드는 같은 미로를, 다른 시드는 다른 미로를 만든다', () => {
    const opts = { rows: 15, cols: 15, seed: 1234 };
    expect(generateMaze(opts)).toEqual(generateMaze(opts));

    const other = generateMaze({ ...opts, seed: 1235 });
    expect(other.mazeData).not.toEqual(generateMaze(opts).mazeData);
  });

  it('옵션이 붙어도 시드가 같으면 결과가 같다', () => {
    const opts = {
      rows: 17,
      cols: 17,
      seed: 42,
      ledges: 6,
      upperFloor: true,
      upperBranches: 2,
    };
    expect(generateMaze(opts)).toEqual(generateMaze(opts));
  });

  it('테두리는 전부 절대벽이다 — 계단을 타고 맵 밖으로 나갈 수 없다', () => {
    for (const seed of [1, 7, 99, 4242]) {
      const { mazeData } = generateMaze({
        rows: 13,
        cols: 19,
        seed,
        ledges: 5,
        upperFloor: true,
        upperBranches: 1,
      });
      const rows = mazeData.length;
      const cols = mazeData[0].length;
      for (let c = 0; c < cols; c++) {
        expect(mazeData[0][c]).toBe(ABSOLUTE_WALL);
        expect(mazeData[rows - 1][c]).toBe(ABSOLUTE_WALL);
      }
      for (let r = 0; r < rows; r++) {
        expect(mazeData[r][0]).toBe(ABSOLUTE_WALL);
        expect(mazeData[r][cols - 1]).toBe(ABSOLUTE_WALL);
      }
    }
  });

  it('짝수 크기를 넣어도 홀수로 보정된다', () => {
    const { mazeData, end } = generateMaze({ rows: 12, cols: 8, seed: 5 });
    expect(mazeData.length).toBe(13);
    expect(mazeData[0].length).toBe(9);
    expect(end).toEqual({ x: 11, y: 7 });

    // 너무 작은 값도 최소 크기(5)로 끌어올린다
    const tiny = generateMaze({ rows: 1, cols: 2, seed: 5 });
    expect(tiny.mazeData.length).toBe(5);
    expect(tiny.mazeData[0].length).toBe(5);
  });

  it('여러 시드·옵션에서 start 에서 end 까지 갈 수 있다', () => {
    const shapes = [
      { rows: 7, cols: 7, ledges: 0, upperFloor: false, upperBranches: 0 },
      { rows: 13, cols: 13, ledges: 4, upperFloor: false, upperBranches: 0 },
      { rows: 19, cols: 11, ledges: 0, upperFloor: true, upperBranches: 0 },
      { rows: 21, cols: 23, ledges: 10, upperFloor: true, upperBranches: 3 },
    ];
    for (const shape of shapes) {
      for (let seed = 0; seed < 12; seed++) {
        const { mazeData, start, end } = generateMaze({ ...shape, seed });
        const path = findPath(mazeData, start, end);
        expect(path, `시드 ${seed} / ${JSON.stringify(shape)}`).not.toBeNull();
        expect(path!.length).toBeGreaterThan(0);
      }
    }
  });

  it('ledges 만큼 턱이 생기고, 그 칸은 양옆이 통로다', () => {
    const ledges = 8;
    const { mazeData } = generateMaze({ rows: 15, cols: 15, seed: 77, ledges });
    const found = cellsOfHeight(mazeData, 1);
    expect(found).toHaveLength(ledges);
    for (const [r, c] of found) {
      expect(
        isBridgeCell(mazeData, r, c),
        `(${r},${c}) 가 통로 사이가 아님`,
      ).toBe(true);
    }
  });

  it('ledges 를 주지 않으면 턱이 하나도 없다', () => {
    const { mazeData } = generateMaze({ rows: 15, cols: 15, seed: 77 });
    expect(cellsOfHeight(mazeData, 1)).toHaveLength(0);
    // 평지 미로의 내부 벽은 전부 높이 2 다
    expect(cellsOfHeight(mazeData, 3)).toHaveLength(0);
  });

  it('upperFloor 면 2층 통로(2)와 계단(1)이 생기고 나머지 벽은 3 이다', () => {
    const { mazeData } = generateMaze({
      rows: 19,
      cols: 19,
      seed: 2024,
      upperFloor: true,
      upperBranches: 2,
    });
    expect(cellsOfHeight(mazeData, 2).length).toBeGreaterThan(3); // 2층 통로
    expect(cellsOfHeight(mazeData, 1).length).toBeGreaterThan(0); // 계단
    expect(cellsOfHeight(mazeData, 3).length).toBeGreaterThan(0); // 넘을 수 없는 벽
  });

  it('2층에서 아무 데나 갈 수 없다 — 높이 3 인 칸에는 발을 디딜 수 없다', () => {
    for (const seed of [3, 31, 314, 3141]) {
      const { mazeData, start, end } = generateMaze({
        rows: 21,
        cols: 21,
        seed,
        ledges: 6,
        upperFloor: true,
        upperBranches: 2,
      });
      const seen = reachableFrom(mazeData, start);

      // 도착점에는 닿고
      expect(seen[end.x][end.y], `시드 ${seed}: 도착 불가`).toBe(true);

      let reachedUpper = 0;
      for (let r = 0; r < mazeData.length; r++) {
        for (let c = 0; c < mazeData[r].length; c++) {
          if (!seen[r][c]) continue;
          // 벽 골격(3)·절대벽(9) 위로는 절대 올라설 수 없어야 한다.
          // 점프 최대 높이가 1.45칸이라 2 → 3 은 원래 오를 수 있다 —
          // 통로에 인접한 3 을 봉인해 두었기에 성립하는 성질이다.
          expect(
            mazeData[r][c],
            `시드 ${seed}: (${r},${c}) 높이 ${mazeData[r][c]} 에 올라섰다`,
          ).toBeLessThanOrEqual(2);
          if (mazeData[r][c] === 2) reachedUpper++;
        }
      }

      // 2층은 실제로 올라갈 수 있어야 하고(계단이 살아 있어야 하고)
      expect(
        reachedUpper,
        `시드 ${seed}: 2층에 올라갈 수 없다`,
      ).toBeGreaterThan(0);
      // 그러면서도 벽 골격 전체가 2층이 되어서는 안 된다.
      // (실측 0.18~0.56 — 시드에 따라 벽 골격의 모양이 크게 달라진다)
      const skeleton =
        reachedUpper +
        cellsOfHeight(mazeData, 3).length +
        cellsOfHeight(mazeData, ABSOLUTE_WALL).length;
      expect(reachedUpper / skeleton).toBeLessThan(0.75);
    }
  });

  it('2층은 길이지 광장이 아니다 — 2×2 로 트인 곳이 없다', () => {
    const { mazeData } = generateMaze({
      rows: 21,
      cols: 21,
      seed: 555,
      upperFloor: true,
      upperBranches: 3,
    });
    const isUpper = (r: number, c: number) => mazeData[r]?.[c] === 2;
    for (let r = 0; r < mazeData.length - 1; r++) {
      for (let c = 0; c < mazeData[r].length - 1; c++) {
        const block =
          isUpper(r, c) &&
          isUpper(r + 1, c) &&
          isUpper(r, c + 1) &&
          isUpper(r + 1, c + 1);
        expect(block, `(${r},${c}) 에서 2층이 2×2 로 트여 있다`).toBe(false);
      }
    }
  });

  it('2층 곁가지를 늘리면 2층 통로가 넓어진다', () => {
    const base = { rows: 21, cols: 21, seed: 909, upperFloor: true };
    const narrow = generateMaze({ ...base, upperBranches: 0 });
    const wide = generateMaze({ ...base, upperBranches: 4 });
    expect(cellsOfHeight(wide.mazeData, 2).length).toBeGreaterThan(
      cellsOfHeight(narrow.mazeData, 2).length,
    );
  });
});
