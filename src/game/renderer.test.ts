import { ABSOLUTE_WALL } from '@type/maze';

import { cellLook, isClimbable, portalsOnSlice } from './renderer';
import { JUMP_MAX_HEIGHT } from './mazeEngine';

// 캔버스에 실제로 칠하는 부분은 브라우저가 있어야 확인할 수 있지만,
// "무엇을 칠할지 정하는" 판단은 순수 함수라 여기서 잡을 수 있다.

describe('렌더 판단', () => {
  describe('칸의 겉모습', () => {
    it('발 높이를 기준으로 벽·바닥·낭떠러지가 갈린다', () => {
      expect(cellLook(2, 0)).toBe('wall');
      expect(cellLook(0, 0)).toBe('floor');
      expect(cellLook(0, 2)).toBe('pit');
    });

    it('2층에 올라서면 높이 2 칸이 바닥이 되고 바닥이 낭떠러지가 된다', () => {
      // 같은 미로라도 서 있는 높이에 따라 화면이 뒤집힌다
      expect(cellLook(2, 2)).toBe('floor');
      expect(cellLook(0, 2)).toBe('pit');
      expect(cellLook(3, 2)).toBe('wall');
    });

    it('절대벽은 어느 높이에서도 벽이다', () => {
      for (const z of [0, 1, 2, 3]) {
        expect(cellLook(ABSOLUTE_WALL, z)).toBe('wall');
      }
    });
  });

  describe('오를 수 있는 턱 표시', () => {
    it('한 단 차이는 오를 수 있고 두 단은 못 오른다', () => {
      expect(isClimbable(1, 0)).toBe(true);
      expect(isClimbable(2, 0)).toBe(false);
      expect(isClimbable(2, 1)).toBe(true);
    });

    it('같은 높이나 아래층은 애초에 벽이 아니다', () => {
      expect(isClimbable(0, 0)).toBe(false);
      expect(isClimbable(0, 2)).toBe(false);
    });

    it('경계는 점프 최대 높이를 따른다', () => {
      expect(isClimbable(JUMP_MAX_HEIGHT, 0)).toBe(true);
      expect(isClimbable(JUMP_MAX_HEIGHT + 0.01, 0)).toBe(false);
    });
  });

  describe('단면에 걸린 입구', () => {
    const portals = [
      { at: { x: 2, y: 2 }, label: 'A' },
      { at: { x: 2, y: 7 }, label: 'B' },
      { at: { x: 7, y: 2 }, label: 'C' },
    ];

    it('열을 고정하면 그 열에 있는 입구만 남는다', () => {
      const found = portalsOnSlice('col', 2, portals);
      expect(found.map((f) => f.portal.label)).toEqual(['A', 'C']);
      // 가로 위치는 행 좌표가 된다(열 고정 = 행이 화면 가로축)
      expect(found.map((f) => f.along)).toEqual([2, 7]);
    });

    it('행을 고정하면 그 행에 있는 입구만 남는다', () => {
      const found = portalsOnSlice('row', 2, portals);
      expect(found.map((f) => f.portal.label)).toEqual(['A', 'B']);
      expect(found.map((f) => f.along)).toEqual([2, 7]);
    });

    it('걸린 입구가 없으면 빈 배열이다', () => {
      expect(portalsOnSlice('col', 5, portals)).toEqual([]);
    });

    it('입구가 아예 없어도 안전하다', () => {
      expect(portalsOnSlice('row', 0, [])).toEqual([]);
    });
  });
});
