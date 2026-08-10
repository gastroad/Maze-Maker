import { ABSOLUTE_WALL, type MazeDataType, type PointType } from '@type/maze';

// 허브는 메뉴를 게임 엔진으로 만든 것이다. 미로를 걸어 다니다 입구에 닿으면
// 그곳으로 들어간다. 덕분에 메뉴 화면에서도 이동·시점 전환을 그대로 익힌다.
//
// 다만 허브는 "길찾기"가 목적이 아니라 "선택"이 목적이다. 미로처럼 꼬아 두면
// 고를 때마다 헤매야 해서 금세 성가셔진다. 그래서 탁 트인 광장으로 두고
// 벽은 입구를 구분해 주는 정도로만 쓴다.

export type PortalKind = 'level' | 'stage' | 'maker' | 'userMaps' | 'back';

export interface Portal {
  at: PointType;
  href: string;
  /** 입구 위에 띄울 짧은 이름. */
  label: string;
  kind: PortalKind;
}

export interface HubMap {
  mazeData: MazeDataType;
  start: PointType;
  portals: Portal[];
}

/** 테두리만 절대벽인 빈 광장. */
function plaza(rows: number, cols: number): MazeDataType {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) =>
      r === 0 || c === 0 || r === rows - 1 || c === cols - 1 ? ABSOLUTE_WALL : 0,
    ),
  );
}

// 입구를 턱으로 감싸 문설주처럼 보이게 했었는데, 입구가 촘촘하면 턱끼리 이어져
// 통로를 끊어 버렸다(왼쪽 끝 입구로 갈 길이 사라졌다). 입구는 초록 발판과
// 이름표로 이미 충분히 구분되므로 판에는 아무것도 두지 않고, 대신 입구 사이를
// 넉넉히 띄운다.

/** 입구 사이 간격(칸). 이름표가 겹치지 않고 사이로 지나다닐 수 있는 최소치. */
const GATE_GAP = 3;

const MAIN_ROWS = 15;
const MAIN_COLS = 15;

/**
 * 메인 허브 — 레벨 다섯 개 입구와 유저 맵·제작 입구.
 * 잠금이 없으므로 모든 입구는 시작점에서 걸어서 닿을 수 있어야 한다.
 */
export function mainHub(levelCount = 5): HubMap {
  const mazeData = plaza(MAIN_ROWS, MAIN_COLS);
  const start: PointType = { x: 7, y: 7 };

  const levelSpots: PointType[] = [
    { x: 2, y: 2 },
    { x: 2, y: 7 },
    { x: 2, y: 12 },
    { x: 7, y: 2 },
    { x: 7, y: 12 },
  ];

  const portals: Portal[] = [];
  for (let i = 0; i < Math.min(levelCount, levelSpots.length); i++) {
    const at = levelSpots[i];
    portals.push({
      at,
      href: `/play/${i + 1}`,
      label: `레벨 ${i + 1}`,
      kind: 'level',
    });
  }

  const userMaps: PointType = { x: 12, y: 4 };
  const maker: PointType = { x: 12, y: 10 };
  portals.push({
    at: userMaps,
    href: '/maplist',
    label: '유저 미로',
    kind: 'userMaps',
  });
  portals.push({ at: maker, href: '/maker', label: '미로 만들기', kind: 'maker' });

  // 광장 한가운데 기둥 — 시작 지점을 눈으로 잡아 주는 표식
  mazeData[5][5] = 2;
  mazeData[5][9] = 2;
  mazeData[9][5] = 2;
  mazeData[9][9] = 2;

  return { mazeData, start, portals };
}

/**
 * 레벨 허브 — 스테이지 입구가 두 줄로 늘어선다.
 * 스테이지 수는 DB 에서 오므로 개수에 맞춰 판을 넓힌다.
 */
export function levelHub(level: number, stages: number[]): HubMap {
  const perRow = Math.ceil(stages.length / 2) || 1;
  // 왼쪽 끝에 '허브로' 문을 두므로 그만큼 여유를 더 둔다
  const cols = Math.max(11, (perRow - 1) * GATE_GAP + 6);
  const mazeData = plaza(9, cols);
  const start: PointType = { x: 4, y: Math.floor(cols / 2) };

  const portals: Portal[] = stages.map((stage, i) => {
    const row = i < perRow ? 2 : 6;
    const col = 3 + (i % perRow) * GATE_GAP;
    const at: PointType = { x: row, y: col };
    return {
      at,
      href: `/play/${level}/${stage}`,
      label: `${level}-${stage}`,
      kind: 'stage' as const,
    };
  });

  // 메인 허브로 돌아가는 문. 화면 안에서 걸어 나갈 수 있어야 하므로
  // 상단 바의 뒤로가기 말고 입구로도 둔다. 시작점 왼쪽 끝에 놓아
  // 스테이지 입구와 헷갈리지 않게 한다.
  const backAt: PointType = { x: 4, y: 1 };
  portals.push({
    at: backAt,
    href: '/play',
    label: '← 허브',
    kind: 'back',
  });

  return { mazeData, start, portals };
}
