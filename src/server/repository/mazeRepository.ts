import 'server-only';
import { eq } from 'drizzle-orm';
import { getDb } from '../db/client';
import { mazes, type MazeRow, type NewMazeRow } from '../db/schema';

// DB 접근만 담당하는 계층 — 비즈니스 로직은 service 에 둔다.
export async function findAllMazes(): Promise<MazeRow[]> {
  return getDb().select().from(mazes);
}

export async function findMazeById(id: string): Promise<MazeRow | undefined> {
  const rows = await getDb().select().from(mazes).where(eq(mazes.id, id));
  return rows[0];
}

export async function insertMaze(data: NewMazeRow): Promise<MazeRow> {
  const rows = await getDb().insert(mazes).values(data).returning();
  return rows[0];
}

export async function deleteMazeById(id: string): Promise<void> {
  await getDb().delete(mazes).where(eq(mazes.id, id));
}
