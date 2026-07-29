export type CellType = 'start' | 'end' | 'wall' | 'road' | 'resolve';
export type MazeDataValueType = 0 | 1;
export type MazeDataType = MazeDataValueType[][];

export interface MazeSizeType {
  col: number;
  row: number;
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

