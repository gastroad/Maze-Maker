import 'server-only';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

type Database = ReturnType<typeof drizzle<typeof schema>>;

let db: Database | undefined;

// DATABASE_URL 확인을 모듈 로드 시점이 아니라 최초 쿼리 시점으로 미룬다.
// (next build 는 force-dynamic 페이지의 쿼리를 실행하지 않으므로 URL 없이도 빌드가 통과된다)
export function getDb(): Database {
  if (!db) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        'DATABASE_URL 환경변수가 설정되지 않았습니다. .env 파일에 Neon 연결 문자열을 넣어주세요.',
      );
    }
    db = drizzle(neon(url), { schema });
  }
  return db;
}
