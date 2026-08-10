import { ABSOLUTE_WALL } from '@type/maze';

import { levelHub, mainHub, type HubMap } from './hubs';
import { findPath } from '@utils/findPath';

/**
 * 허브에서 가장 중요한 성질은 "모든 입구에 걸어서 닿을 수 있다"이다.
 * 잠금이 없기로 했으므로 하나라도 막히면 그 스테이지는 들어갈 방법이 없어진다.
 * 배치를 손볼 때마다 눈으로 확인하지 않도록 여기서 잡는다.
 */
function unreachable(hub: HubMap): string[] {
  return hub.portals
    .filter((p) => !findPath(hub.mazeData, hub.start, p.at))
    .map((p) => `${p.label}(${p.at.x},${p.at.y})`);
}

describe('허브', () => {
  describe('메인 허브', () => {
    it('모든 입구에 걸어서 닿을 수 있다', () => {
      expect(unreachable(mainHub(5))).toEqual([]);
    });

    it('레벨 수가 줄어도 입구가 깨지지 않는다', () => {
      for (const count of [1, 2, 3, 4, 5]) {
        const hub = mainHub(count);
        expect(hub.portals.filter((p) => p.kind === 'level')).toHaveLength(
          count,
        );
        expect(unreachable(hub)).toEqual([]);
      }
    });

    it('유저 미로와 제작 입구가 있다', () => {
      const kinds = mainHub(5).portals.map((p) => p.kind);
      expect(kinds).toContain('userMaps');
      expect(kinds).toContain('maker');
    });

    it('테두리는 절대벽이라 밖으로 나갈 수 없다', () => {
      const { mazeData } = mainHub(5);
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
    });
  });

  describe('레벨 허브', () => {
    const stages = Array.from({ length: 10 }, (_, i) => i + 1);

    it('스테이지 10개와 돌아가는 문이 모두 열려 있다', () => {
      const hub = levelHub(3, stages);
      expect(hub.portals).toHaveLength(11);
      expect(unreachable(hub)).toEqual([]);
    });

    it('스테이지 수가 달라져도 모든 입구에 닿는다', () => {
      for (const n of [1, 2, 5, 7, 10, 14]) {
        const hub = levelHub(1, Array.from({ length: n }, (_, i) => i + 1));
        expect(unreachable(hub)).toEqual([]);
      }
    });

    it('입구끼리 같은 칸에 겹치지 않는다', () => {
      const hub = levelHub(2, stages);
      const keys = hub.portals.map((p) => `${p.at.x},${p.at.y}`);
      expect(new Set(keys).size).toBe(keys.length);
    });

    it('입구가 놓인 칸은 바닥이라 밟고 설 수 있다', () => {
      const hub = levelHub(4, stages);
      for (const p of hub.portals) {
        expect(hub.mazeData[p.at.x][p.at.y]).toBe(0);
      }
    });

    it('메인 허브로 돌아가는 문이 있다', () => {
      const back = levelHub(5, stages).portals.find((p) => p.kind === 'back');
      expect(back?.href).toBe('/play');
    });
  });
});
