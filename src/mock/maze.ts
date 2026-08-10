import { MazeDataType, MazeSizeType, MazeType, PointType } from "@type/maze"

export const mockStart: PointType = { x: 0, y: 0 }
export const mockEnd: PointType = { x: 4, y: 4 }
export const mockMazeSize: MazeSizeType = { rows: 5, cols: 5 }
export const mockResolvedPath: PointType[] = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 1 },
    { x: 4, y: 2 },
    { x: 4, y: 3 },
]
export const mockMazeData: MazeDataType = [
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
]
export const mockMaze: MazeType = {
    id: 'test-id',
    title: 'test-title',
    name: 'test-name',
    mazeSize: mockMazeSize,
    start: mockStart,
    end: mockEnd,
    mazeData: mockMazeData,
    resolvedPath: mockResolvedPath,
}

