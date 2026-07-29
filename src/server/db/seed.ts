import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { mazes } from './schema';
import type { MazeType } from '../../types/maze';

// seed 는 CLI(tsx) 스크립트라 server-only 인 client.ts 를 쓰지 않고
// 자체 연결을 만든다. (server-only 는 RSC 번들러 밖에서 import 시 예외를 던짐)
async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL 환경변수가 설정되지 않았습니다. .env 를 확인하세요.');
  }

  const dataPath = join(process.cwd(), 'src/server/db/seed-data.json');
  const data: MazeType[] = JSON.parse(readFileSync(dataPath, 'utf8'));

  const db = drizzle(neon(url), { schema: { mazes } });

  // 기존 id 를 그대로 보존하고, 이미 있으면 건너뛴다(onConflictDoNothing).
  for (const maze of data) {
    await db
      .insert(mazes)
      .values({
        id: maze.id,
        title: maze.title,
        name: maze.name,
        mazeSize: maze.mazeSize,
        mazeData: maze.mazeData,
        start: maze.start,
        end: maze.end,
        resolvedPath: maze.resolvedPath ?? [],
      })
      .onConflictDoNothing();
  }

  console.log(`✓ 시드 완료: ${data.length}개 미로를 Neon 에 이관했습니다.`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('시드 실패:', err);
    process.exit(1);
  });
