import {
  ABSOLUTE_WALL,
  MAX_SIZE,
  MAX_TERRAIN_HEIGHT,
  MIN_SIZE,
  type MazeType,
  type PointType,
} from '../../types/maze';

// POST /api/mazelist 는 로그인만 통과하면 임의의 JSON 을 jsonb 에 그대로 넣을 수
// 있었다. 타입 단언(`const body: MazeType = await req.json()`)은 런타임에 아무것도
// 막지 못하므로, DB 에 닿기 전에 여기서 형태·크기·값 범위를 실제로 확인한다.
//
// 검증 라이브러리를 새로 들이지 않은 이유: 검사할 스키마가 이 한 벌뿐이고
// mazeData 의 "모든 행 길이가 같은 직사각형" 같은 조건은 어차피 직접 써야 한다.

/** 사람이 읽을 이름의 상한. DB 는 text 라 길이를 막아 주지 않는다. */
const MAX_TITLE_LENGTH = 60;
const MAX_NAME_LENGTH = 40;

export type ValidationResult<T> =
  { ok: true; value: T } | { ok: false; message: string };

const fail = (message: string): { ok: false; message: string } => ({
  ok: false,
  message,
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** 판 안의 정수 좌표인지. x 가 행, y 가 열이다(mazeData[x][y]). */
function parsePoint(
  value: unknown,
  rows: number,
  cols: number,
  label: string,
): ValidationResult<PointType> {
  if (!isRecord(value)) return fail(`${label} 좌표가 없습니다.`);
  const { x, y } = value;
  if (!Number.isInteger(x) || !Number.isInteger(y)) {
    return fail(`${label} 좌표는 정수여야 합니다.`);
  }
  const px = x as number;
  const py = y as number;
  if (px < 0 || px >= rows || py < 0 || py >= cols) {
    return fail(`${label} 좌표가 판 밖입니다.`);
  }
  return { ok: true, value: { x: px, y: py } };
}

function parseName(
  value: unknown,
  max: number,
  label: string,
): ValidationResult<string> {
  if (typeof value !== 'string') return fail(`${label}을(를) 입력해 주세요.`);
  const trimmed = value.trim();
  if (trimmed.length === 0) return fail(`${label}을(를) 입력해 주세요.`);
  if (trimmed.length > max) {
    return fail(`${label}은(는) ${max}자 이내여야 합니다.`);
  }
  return { ok: true, value: trimmed };
}

/**
 * POST 본문을 검증해 저장 가능한 미로로 바꾼다.
 *
 * mazeSize 와 userId 는 여기서 뽑지 않는다. 크기의 원천은 언제나 mazeData 이고
 * 소유자는 서버 세션만 신뢰하므로, 둘 다 mazeService 가 채운다.
 */
export function parseMazeInput(
  body: unknown,
): ValidationResult<Omit<MazeType, 'mazeSize'>> {
  if (!isRecord(body)) return fail('요청 본문이 올바르지 않습니다.');

  const title = parseName(body.title, MAX_TITLE_LENGTH, '제목');
  if (!title.ok) return title;
  const name = parseName(body.name, MAX_NAME_LENGTH, '만든 사람');
  if (!name.ok) return name;

  const { mazeData } = body;
  if (!Array.isArray(mazeData)) return fail('미로 데이터가 없습니다.');

  const rows = mazeData.length;
  if (rows < MIN_SIZE || rows > MAX_SIZE) {
    return fail(`미로의 행은 ${MIN_SIZE}~${MAX_SIZE} 사이여야 합니다.`);
  }
  if (!Array.isArray(mazeData[0])) return fail('미로 데이터가 없습니다.');

  const cols = mazeData[0].length;
  if (cols < MIN_SIZE || cols > MAX_SIZE) {
    return fail(`미로의 열은 ${MIN_SIZE}~${MAX_SIZE} 사이여야 합니다.`);
  }

  for (const row of mazeData) {
    // 직사각형이 아니면 렌더러와 경로 탐색이 모두 mazeData[0].length 를 믿다가 깨진다
    if (!Array.isArray(row) || row.length !== cols) {
      return fail('미로의 모든 행 길이가 같아야 합니다.');
    }
    for (const cell of row) {
      const valid =
        Number.isInteger(cell) &&
        ((cell >= 0 && cell <= MAX_TERRAIN_HEIGHT) || cell === ABSOLUTE_WALL);
      if (!valid) {
        return fail(
          `미로의 칸 값은 0~${MAX_TERRAIN_HEIGHT} 또는 ${ABSOLUTE_WALL} 이어야 합니다.`,
        );
      }
    }
  }

  const start = parsePoint(body.start, rows, cols, '시작점');
  if (!start.ok) return start;
  const end = parsePoint(body.end, rows, cols, '도착점');
  if (!end.ok) return end;

  // 저장된 최적 경로는 별점 기준선일 뿐이라 없어도 된다. 있으면 판 안인지만 본다.
  let resolvedPath: PointType[] | undefined;
  if (body.resolvedPath !== undefined && body.resolvedPath !== null) {
    if (!Array.isArray(body.resolvedPath)) {
      return fail('최적 경로가 올바르지 않습니다.');
    }
    if (body.resolvedPath.length > rows * cols) {
      return fail('최적 경로가 판 크기보다 깁니다.');
    }
    const points: PointType[] = [];
    for (const raw of body.resolvedPath) {
      const point = parsePoint(raw, rows, cols, '최적 경로의');
      if (!point.ok) return point;
      points.push(point.value);
    }
    resolvedPath = points;
  }

  return {
    ok: true,
    value: {
      title: title.value,
      name: name.value,
      mazeData: mazeData as number[][],
      start: start.value,
      end: end.value,
      resolvedPath,
    },
  };
}
