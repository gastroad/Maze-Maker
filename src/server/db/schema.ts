import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  integer,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import type {
  MazeSizeType,
  MazeDataType,
  PointType,
} from '../../types/maze';

// 미로는 관계가 없고 JSON 중심 데이터라 jsonb 컬럼으로 강타입 매핑한다.
// (@type/maze 의 타입을 $type<>() 로 그대로 재사용)
export const mazes = pgTable(
  'mazes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    name: text('name').notNull(),
    mazeSize: jsonb('maze_size').$type<MazeSizeType>().notNull(),
    mazeData: jsonb('maze_data').$type<MazeDataType>().notNull(),
    start: jsonb('start').$type<PointType>().notNull(),
    end: jsonb('end').$type<PointType>().notNull(),
    resolvedPath: jsonb('resolved_path').$type<PointType[]>(),
    // 미로를 만든 Neon Auth 사용자 id (nullable — 기존/비로그인 미로는 null).
    userId: text('user_id'),
    // 공식 스테이지의 좌표(1-1 ~ 5-10). 둘 다 null 이면 유저가 만든 미로다.
    // 이렇게 두면 기존 데이터를 건드리지 않고도 두 종류를 나눌 수 있다.
    level: integer('level'),
    stage: integer('stage'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    // 같은 (레벨, 스테이지)가 두 번 들어가지 않게. 재시드해도 안전하다.
    uniqueIndex('mazes_level_stage_idx').on(table.level, table.stage),
  ],
);

export type MazeRow = typeof mazes.$inferSelect;
export type NewMazeRow = typeof mazes.$inferInsert;
