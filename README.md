<div align="center">

# 🧩 Maze Maker

**나만의 미로를 만들고, 직접 플레이하는 웹 게임**

허브 월드를 걸어 다니며 스테이지를 고르고, 높낮이가 있는 미로를 자유롭게 이동해
풀어냅니다. 탑다운으로 막힌 벽은 시점을 옆으로 돌려 점프로 넘습니다.

<br/>

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-2D3748?style=flat-square)
![Drizzle](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black)
![Neon](https://img.shields.io/badge/Neon_Postgres-00E599?style=flat-square&logo=postgresql&logoColor=white)
![vanilla-extract](https://img.shields.io/badge/vanilla--extract-FF017D?style=flat-square)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)

</div>

---

## ✨ 주요 기능

| 기능 | 설명 |
| --- | --- |
| 🕹 **허브 월드** | 메뉴가 곧 게임이다 — 광장을 걸어 다니다 입구에 올라서면 그곳으로 들어간다 |
| 🗺 **캠페인 50 스테이지** | 1-1 ~ 5-10 을 절차 생성. 시드가 같으면 언제나 같은 미로가 나온다 |
| ⛰ **높이맵 지형** | 한 벌의 데이터가 탑다운에서는 통과 여부로, 사이드뷰에서는 지형 높이로 해석된다 |
| 🔄 **시점 전환** | 탑다운 ↔ 사이드뷰. 한 줄을 잘라 세워 점프로 턱과 2층 통로를 넘는다 |
| 🎮 **자유 이동** | 격자 스텝이 아닌 아케이드식 자유 이동. 방향키 · WASD · 가상 조이스틱 |
| 🛠 **미로 제작** | 캔버스 위에서 높이 브러시(바닥·턱·벽·높은 벽·외벽)로 지형을 그리고 단면을 미리 본다 |
| 🤖 **정답 자동 탐색** | 높이를 이해하는 A\* 가 최단 경로를 계산한다(점프로 오를 수 있는 단차만 등반) |
| 🏆 **시간 기반 별점** | par 타임 대비 얼마나 빨리 주파했는지로 별 3개가 깎인다 |
| 💡 **정답 보기** | 저장된 최적 경로를 보드 위에 선으로 표시 |
| 📜 **유저 미로 목록** | 다른 사람이 만든 미로를 골라 바로 플레이 |
| 🔐 **로그인 / 소유권** | 로그인해야 미로를 만들 수 있고, 내가 만든 미로만 삭제할 수 있음 |

---

## 🧰 기술 스택

- **프레임워크** — Next.js 16 (App Router) · React 19
- **언어** — TypeScript
- **게임** — 자체 엔진 (`src/game`) · Canvas 2D 렌더러 · requestAnimationFrame 루프
- **상태 관리** — Zustand
- **데이터베이스** — Neon(Postgres) + Drizzle ORM (`@neondatabase/serverless`)
- **인증** — Neon Auth (Managed Better Auth) · 이메일/비밀번호
- **스타일** — vanilla-extract(`.css.ts`) + 디자인 토큰 기반 다크/라이트 테마
- **컴포넌트 설계** — Atomic Design
- **개발 도구** — Vitest · Testing Library · ESLint 9(flat config) · Prettier
- **배포** — Vercel

---

## 🚀 시작하기

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정 (.env)
#    Neon 콘솔에서 값을 복사해 아래 4개를 채웁니다.
#    DATABASE_URL             : Postgres 연결 문자열 (Pooled connection 권장)
#    NEON_AUTH_BASE_URL       : Auth URL (Neon 콘솔 > Auth)
#    NEXT_PUBLIC_NEON_AUTH_URL: 위와 동일한 값 (클라이언트용)
#    NEON_AUTH_COOKIE_SECRET  : 32자 이상 시크릿 (openssl rand -base64 32)

# 3. DB 마이그레이션 & 시드
npm run db:migrate
npm run db:seed-stages -- --apply   # 캠페인 1-1 ~ 5-10 (50개)
npm run db:seed                     # (선택) 예시 미로 3개

# 4. 개발 서버 실행
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

### 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm start` | 프로덕션 서버 실행 |
| `npm run analyze` | 번들 크기 분석 빌드 |
| `npm run test:ci` | 테스트 1회 실행 |
| `npm test` | 테스트 watch 모드 |
| `npm run coverage` | 커버리지 리포트 |
| `npm run lint` | ESLint 검사 |
| `npm run prettier` | 소스 포매팅 |
| `npm run db:generate` | 스키마 → 마이그레이션 SQL 생성 |
| `npm run db:migrate` | 마이그레이션 적용 |
| `npm run db:push` | 스키마를 DB 에 직접 반영(개발용) |
| `npm run db:studio` | Drizzle Studio(GUI) 실행 |
| `npm run db:seed` | 예시 미로 시드 |
| `npm run db:seed-stages` | 캠페인 스테이지 1-1 ~ 5-10 생성·시드 |

### 일회성 마이그레이션 스크립트

package.json 에 등록하지 않은 일회성 스크립트입니다. **모두 dry-run 이 기본**이고,
`--apply` 를 붙여야 실제로 DB 를 건드립니다.

| 스크립트 | 하는 일 |
| --- | --- |
| `npx tsx src/server/db/migrate-heights.ts` | 0/1 이분법으로 저장된 옛 미로의 벽(1)을 넘을 수 없는 벽(2)으로 올린다. `--with-sample` 로 2층 통로 검증용 미로를 추가하고, `--recompute-paths` 로 별점 기준선을 다시 계산한다 |
| `npx tsx src/server/db/migrate-maze-size.ts` | `mazeSize` 의 키를 옛 `{ col, row }` 에서 `{ rows, cols }` 로 바로잡는다. 값은 옮겨 담지 않고 `mazeData` 에서 다시 센다 |

`seed-stages.ts` 도 같은 규칙을 따릅니다 — `--apply` 없이는 생성·검증만 하고
(그래서 `DATABASE_URL` 없이도 돕니다), `--update` 로 기존 스테이지를 덮어쓰며,
`--print 3-7` 로 특정 스테이지를 터미널에 그려 볼 수 있습니다.

---

## 🗂 프로젝트 구조

FE(클라이언트)와 BE(서버) 계층을 엄격하게 분리했습니다. DB 접근은 오직 `src/server/**`
안에서만 일어나며(`import 'server-only'` 로 클라이언트 번들 유입 차단), 클라이언트는
HTTP(`@api`)로만 서버에 접근합니다. UI는 [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) 패턴으로 구성합니다.

```
src/
├── app/                  # 라우트(App Router) · API Route Handlers
│   ├── play/             #   허브 → 레벨 허브([level]) → 스테이지([level]/[stage])
│   ├── maker/            #   미로 제작 (로그인 필요)
│   ├── maplist/          #   유저 미로 목록 · 플레이([id])
│   ├── auth/sign-in/     #   로그인 · 회원가입
│   └── api/
│       ├── mazelist/     #   미로 저장(POST) · 삭제(DELETE)
│       └── auth/[...path]/#  Neon Auth 프록시 핸들러
├── game/                 # 🎮 게임 코어 (프레임워크 무관, 순수 TS)
│   ├── mazeEngine.ts     #   물리·시점 전환·승리 판정·별점
│   ├── renderer.ts       #   Canvas 2D 렌더러 · 테마 팔레트 읽기
│   ├── sprites.ts        #   코드로 그리는 스프라이트
│   ├── mazeGenerator.ts  #   절차적 미로 생성기(시드 기반, 재현 가능)
│   └── hubs.ts           #   허브 맵과 입구 배치
├── components/           # UI (atoms · molecules · organisms · templates)
├── styles/               # vanilla-extract 디자인 토큰 · 테마 · 리셋
├── state/                # 🖥️ FE: Zustand 스토어 (game · maker)
├── server/               # 🔒 BE 전용 (server-only)
│   ├── db/               #   Drizzle client · schema · seed · 마이그레이션 스크립트
│   ├── repository/       #   DB 접근 계층
│   ├── service/          #   비즈니스 로직 (소유권 검증 등)
│   ├── validation/       #   요청 본문 검증 (POST 미로)
│   └── auth/             #   Neon Auth 서버 인스턴스
├── lib/auth/             # 🖥️ FE: 클라이언트 인증 (authClient)
├── api/                  # 🖥️ FE→BE HTTP 클라이언트 (fetch)
├── hooks/                # useGameLoop · useArcadeInput · useThemePalette
├── utils/                # findPath (높이를 이해하는 A*) · formatTime
└── types/                # FE·BE 공용 타입
```

---

## 🧠 핵심 동작

### 높이맵 지형

미로 데이터는 `number[][]` 한 벌이고, 각 칸의 값이 곧 지형의 높이입니다
([`types/maze.ts`](src/types/maze.ts)).

| 값 | 뜻 |
| --- | --- |
| `0` | 바닥 — 어디서든 통과 |
| `1` | 턱 — 탑다운에서는 막히지만 사이드뷰에서 점프로 넘는다 |
| `2` | 벽 — 미로의 뼈대. 높이 1 위에서 점프하면 올라설 수 있다(= 2층 통로) |
| `3` | 높은 벽 — 높이 2 위에서 점프해야 오른다 |
| `9` | 절대벽(`ABSOLUTE_WALL`) — 어떤 높이에서도 넘을 수 없다. 맵 경계에 쓴다 |

같은 데이터를 탑다운에서는 "내 발 높이보다 높으면 통과 불가"로, 사이드뷰에서는
그대로 지형의 높이로 읽습니다. 기존 0/1 데이터는 이 규약의 부분집합이라 그대로
유효합니다.

### 시점 전환

스페이스(또는 축 버튼)를 누르면 서 있는 줄 하나를 잘라 옆에서 본 단면으로 세웁니다
([`game/mazeEngine.ts`](src/game/mazeEngine.ts)의 `enterSideView`/`exitSideView`).
점프로 오를 수 있는 최대 높이는 약 1.45칸이라 **턱(1)은 넘고 벽(2)은 못 넘는** 것이
맵 디자인의 기준선입니다. 공중에 떠 있는 동안에는 탑다운으로 돌아갈 수 없습니다.

### 경로 탐색과 별점

[`utils/findPath.ts`](src/utils/findPath.ts) 의 A\*(이진 힙)가 플레이어가 실제로 할
수 있는 이동만 따라갑니다 — 같은 높이는 걷고, 낮은 칸은 떨어지고, 높은 칸은 단차가
점프 한계 이내일 때만 등반(더 비싼 비용)합니다.

별점은 시간 기반입니다. **par 타임 = 최적 경로 칸 수 ÷ 최고 속도(7칸/초)** 이고,
경과 시간이 par 의 2.5배 이내면 ★★★, 4.5배 이내면 ★★, 그보다 느리면 ★ 입니다
([`game/mazeEngine.ts`](src/game/mazeEngine.ts)의 `parMs`/`computeStars`).
이동 수(moves)로 점수를 깎던 방식은 자유 이동으로 바뀌면서 사라졌습니다.

### 허브 월드

메뉴를 게임 엔진으로 돌립니다([`game/hubs.ts`](src/game/hubs.ts)). 탁 트인 광장을
걸어 다니다 입구 발판에 올라서면 그 경로로 이동합니다. 메뉴에서부터 이동과 시점
전환을 자연스럽게 익히게 하는 것이 목적이라, 허브 자체는 길찾기 대상이 아니라
선택지를 늘어놓은 공간으로 둡니다.

### 캠페인 생성

[`game/mazeGenerator.ts`](src/game/mazeGenerator.ts) 가 Recursive Backtracker 로
완전 미로를 만든 뒤, 양옆이 통로인 벽만 턱(1)으로 낮추고 벽 골격 위에 2층 통로를
얹습니다. `Math.random()` 을 쓰지 않아 **시드가 같으면 언제 어디서 돌려도 같은 미로**가
나옵니다. [`server/db/seed-stages.ts`](src/server/db/seed-stages.ts) 는 (레벨, 스테이지)
에서 시드를 뽑아 후보 여럿을 만들고 난이도 곡선에 맞는 것을 골라 50개를 시드합니다.

### 그 밖에

- **렌더링** — 셀마다 DOM 노드를 만들지 않고 캔버스 한 장에 그립니다. 100×100 이면
  노드가 10,000개가 되어 편집도 목록 렌더도 버티지 못하기 때문입니다.
- **상태 관리** — 제작(`state/maker`)과 플레이(`state/game`) 상태를 Zustand 스토어로
  분리합니다. 물리 상태(위치·속도·높이)는 성능을 위해 게임 루프의 ref 가 소유하고,
  스토어에는 UI 가 필요로 하는 값만 둡니다.
- **데이터 흐름** — 서버 컴포넌트는 `@server/service` 를 통해 Neon(Drizzle)에 직접
  접근하고, 클라이언트는 저장·삭제만 `@api` 로 HTTP 요청을 보냅니다.
- **인증/소유권** — 미로 생성·삭제는 로그인이 필요하며, 미로에는 생성자(`userId`)가
  기록되어 본인이 만든 미로만 삭제할 수 있습니다. 저장 요청의 본문은
  [`server/validation`](src/server/validation/mazeInput.ts) 에서 크기·값 범위까지
  검증하고, `userId` 와 `mazeSize` 는 요청 값을 믿지 않고 서버가 다시 채웁니다.

---

<div align="center">

React · TypeScript · Next.js · Neon 으로 제작되었습니다.

</div>
