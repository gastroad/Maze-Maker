export type CellType = 'start' | 'end' | 'wall' | 'road' | 'resolve';

/**
 * 셀의 지형 높이. 탑다운에서는 "내 발 높이보다 높으면 통과 불가"로,
 * 사이드뷰에서는 그대로 지형의 높이로 해석된다(같은 데이터 한 벌).
 *
 *   0  바닥      — 어디서든 통과
 *   1  턱        — 탑다운 막힘, 사이드뷰에서 점프로 넘음
 *   2  벽        — 미로의 뼈대. 높이 1 위에서 점프하면 올라설 수 있다
 *   3  높은 벽   — 높이 2 위에서 점프해야 올라설 수 있다
 *   9  절대벽    — 어떤 높이에서도 넘을 수 없다(외벽). ABSOLUTE_WALL 참고
 *
 * 기존 0/1 데이터는 이 타입의 부분집합이라 그대로 유효하다.
 */
export type MazeDataValueType = number;
export type MazeDataType = MazeDataValueType[][];

/**
 * 어떤 높이에서도 넘을 수 없는 벽. 맵 경계와 외벽에 쓴다.
 * 점프는 한 번에 약 1.45칸을 오르므로 계단만 있으면 어디든 올라갈 수 있는데,
 * 이 값이 그 상승을 끊어 플레이어가 맵 밖으로 나가는 것을 막는다.
 */
export const ABSOLUTE_WALL = 9;

/**
 * 미로의 크기. 과거에는 `{ col, row }` 였는데 col 이 행 수, row 가 열 수라
 * 읽는 사람마다 뒤집어 해석하는 문제가 있어 이름을 바로잡았다.
 * 실제 크기의 원천은 언제나 mazeData 이고(`mazeData.length` × `mazeData[0].length`)
 * 이 값은 그와 일치해야 한다.
 */
export interface MazeSizeType {
  rows: number; // 행 수 = mazeData.length
  cols: number; // 열 수 = mazeData[0].length
}
export interface PointType {
  x: number;
  y: number;
}
export interface MazeBoardType {
  start: PointType;
  end: PointType;
  mazeData: MazeDataType;
  resolvedPath?: PointType[];
}
export interface MazeInfoType {
  id?: string;
  title: string;
  name: string;
  mazeSize: MazeSizeType;
  // 미로를 만든 Neon Auth 사용자 id. 로그인 없이 생성된(기존) 미로는 없음.
  userId?: string;
}

export type MazeType = MazeBoardType & MazeInfoType;

