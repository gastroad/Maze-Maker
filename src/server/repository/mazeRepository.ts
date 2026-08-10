import 'server-only';
import { and, asc, desc, eq, isNotNull, isNull } from 'drizzle-orm';
import { getDb } from '../db/client';
import { mazes, type MazeRow, type NewMazeRow } from '../db/schema';

// DB 접근만 담당하는 계층 — 비즈니스 로직은 service 에 둔다.
export async function findAllMazes(): Promise<MazeRow[]> {
  return getDb().select().from(mazes);
}

// level 이 채워져 있으면 공식 스테이지, 비어 있으면 유저가 만든 미로다.
// 목록을 이 기준으로 나눠서 캠페인과 유저 제작이 섞이지 않게 한다.

/** 유저가 만든 미로만. 최근에 만든 것이 앞에 온다. */
export async function findUserMazes(): Promise<MazeRow[]> {
  return getDb()
    .select()
    .from(mazes)
    .where(isNull(mazes.level))
    .orderBy(desc(mazes.createdAt));
}

/** 공식 스테이지 전체를 1-1 → 5-10 순서로. */
export async function findStages(): Promise<MazeRow[]> {
  return getDb()
    .select()
    .from(mazes)
    .where(isNotNull(mazes.level))
    .orderBy(asc(mazes.level), asc(mazes.stage));
}

/** 한 레벨의 스테이지들. */
export async function findStagesByLevel(level: number): Promise<MazeRow[]> {
  return getDb()
    .select()
    .from(mazes)
    .where(and(eq(mazes.level, level), isNotNull(mazes.stage)))
    .orderBy(asc(mazes.stage));
}

/** 좌표로 스테이지 하나를 찾는다(1-1 ~ 5-10). */
export async function findStage(
  level: number,
  stage: number,
): Promise<MazeRow | undefined> {
  const rows = await getDb()
    .select()
    .from(mazes)
    .where(and(eq(mazes.level, level), eq(mazes.stage, stage)));
  return rows[0];
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
