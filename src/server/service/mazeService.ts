import 'server-only';
import type { MazeType } from '../../types/maze';
import type { MazeRow } from '../db/schema';
import {
  findAllMazes,
  findMazeById,
  insertMaze,
  deleteMazeById,
} from '../repository/mazeRepository';

// DB 행(MazeRow) → 앱 공용 타입(MazeType) 변환.
// createdAt 은 앱 타입에 없으므로 제거하고, nullable resolvedPath 는 undefined 로 정규화한다.
function toMazeType(row: MazeRow): MazeType {
  return {
    id: row.id,
    title: row.title,
    name: row.name,
    mazeSize: row.mazeSize,
    mazeData: row.mazeData,
    start: row.start,
    end: row.end,
    resolvedPath: row.resolvedPath ?? undefined,
    userId: row.userId ?? undefined,
  };
}

// 소유권 검증 실패 시 라우트에서 403 으로 변환할 수 있도록 별도 에러로 던진다.
export class MazeOwnershipError extends Error {
  constructor(message = '본인이 만든 미로만 삭제할 수 있습니다.') {
    super(message);
    this.name = 'MazeOwnershipError';
  }
}

export async function getMazes(): Promise<MazeType[]> {
  const rows = await findAllMazes();
  return rows.map(toMazeType);
}

export async function getMazeById(id: string): Promise<MazeType | undefined> {
  const row = await findMazeById(id);
  return row ? toMazeType(row) : undefined;
}

export async function createMaze(
  input: MazeType,
  userId: string,
): Promise<MazeType> {
  // id 는 클라이언트가 보내더라도 무시하고 DB(gen_random_uuid)가 생성한다.
  // 소유자(userId)는 서버 세션에서 받은 값만 신뢰한다(요청 본문 무시).
  const row = await insertMaze({
    title: input.title,
    name: input.name,
    mazeSize: input.mazeSize,
    mazeData: input.mazeData,
    start: input.start,
    end: input.end,
    resolvedPath: input.resolvedPath ?? [],
    userId,
  });
  return toMazeType(row);
}

// 본인이 소유한 미로만 삭제 가능. 소유자가 아니면 MazeOwnershipError.
export async function deleteMaze(id: string, userId: string): Promise<void> {
  const row = await findMazeById(id);
  if (!row) return;
  if (row.userId !== userId) {
    throw new MazeOwnershipError();
  }
  await deleteMazeById(id);
}
