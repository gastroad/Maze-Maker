<div align="center">

# 🧩 Maze Maker

**나만의 미로를 만들고, 직접 플레이하는 웹 게임**

미로를 그려 저장하고, 목록에서 골라 방향키로 플레이할 수 있습니다.
A\* 알고리즘으로 정답 경로를 자동으로 찾아줍니다.

<br/>

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-2D3748?style=flat-square)
![Drizzle](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black)
![Neon](https://img.shields.io/badge/Neon_Postgres-00E599?style=flat-square&logo=postgresql&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?style=flat-square&logo=sass&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white)

</div>

---

## ✨ 주요 기능

| 기능 | 설명 |
| --- | --- |
| 🛠 **미로 제작** | 그리드 위에서 시작/도착 지점과 벽·길을 클릭(드래그)으로 배치 |
| 🤖 **정답 자동 탐색** | A\* 알고리즘으로 시작→도착 최단 경로를 계산해 저장 |
| 🎮 **플레이** | 방향키로 캐릭터를 이동, 도착 시 점수 정산 |
| 🏆 **점수 시스템** | 이동할수록 점수가 차감되어 효율적인 풀이를 유도 |
| 💡 **정답 보기** | 저장된 정답 경로를 보드 위에 표시 |
| 📜 **미로 목록** | 제작된 미로를 목록에서 선택해 바로 플레이 |
| 🔐 **로그인 / 소유권** | 로그인해야 미로를 만들 수 있고, 내가 만든 미로만 삭제할 수 있음 |

---

## 🧰 기술 스택

- **프레임워크** — Next.js 16 (App Router) · React 19
- **언어** — TypeScript
- **상태 관리** — Zustand
- **데이터베이스** — Neon(Postgres) + Drizzle ORM (`@neondatabase/serverless`)
- **인증** — Neon Auth (Managed Better Auth) · 이메일/비밀번호
- **스타일** — Sass(SCSS) + 디자인 토큰 기반 다크 테마
- **컴포넌트 설계** — Atomic Design
- **개발 도구** — Jest · Testing Library · ESLint 9(flat config) · Prettier
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

# 3. DB 마이그레이션 & (선택) 시드
npm run db:migrate
npm run db:seed        # 예시 미로 3개를 이관

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
| `npm run test:ci` | 테스트 1회 실행 |
| `npm test` | 테스트 watch 모드 |
| `npm run lint` | ESLint 검사 |
| `npm run db:generate` | 스키마 → 마이그레이션 SQL 생성 |
| `npm run db:migrate` | 마이그레이션 적용 |
| `npm run db:studio` | Drizzle Studio(GUI) 실행 |
| `npm run db:seed` | 예시 데이터 시드 |

---

## 🗂 프로젝트 구조

FE(클라이언트)와 BE(서버) 계층을 엄격하게 분리했습니다. DB 접근은 오직 `src/server/**`
안에서만 일어나며(`import 'server-only'` 로 클라이언트 번들 유입 차단), 클라이언트는
HTTP(`@api`)로만 서버에 접근합니다. UI는 [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) 패턴으로 구성합니다.

```
src/
├── app/                  # 라우트(App Router) · API Route Handlers
│   ├── maker/            #   미로 제작 (로그인 필요)
│   ├── maplist/          #   미로 목록 · 플레이([id])
│   ├── auth/sign-in/     #   로그인 · 회원가입
│   └── api/
│       ├── mazelist/     #   미로 CRUD API
│       └── auth/[...path]/#  Neon Auth 프록시 핸들러
├── components/           # UI (atoms · molecules · organisms · templates)
├── state/                # 🖥️ FE: Zustand 스토어 (game · maker)
├── server/               # 🔒 BE 전용 (server-only)
│   ├── db/               #   Drizzle client · schema · seed
│   ├── repository/       #   DB 접근 계층
│   ├── service/          #   비즈니스 로직 (소유권 검증 등)
│   └── auth/             #   Neon Auth 서버 인스턴스
├── lib/auth/             # 🖥️ FE: 클라이언트 인증 (authClient)
├── api/                  # 🖥️ FE→BE HTTP 클라이언트 (fetch)
├── hooks/                # 커스텀 훅
├── utils/                # findPath (A* 알고리즘)
├── types/                # FE·BE 공용 타입
└── assets/               # 스타일 토큰 · 이미지
```

---

## 🧠 핵심 동작

- **경로 탐색** — [`utils/findPath.ts`](src/utils/findPath.ts) 의 A\* 알고리즘이 맨해튼 거리 휴리스틱으로 최단 경로를 계산합니다.
- **상태 관리** — 제작(`state/maker`)과 플레이(`state/game`) 상태를 Zustand 스토어로 분리해 관리합니다.
- **데이터 흐름** — 서버 컴포넌트/Route Handler는 `@server/service` 를 통해 Neon(Drizzle)에 접근하고, 클라이언트는 `@api` 로 HTTP 요청만 보냅니다.
- **인증/소유권** — 미로 생성·삭제는 로그인이 필요하며, 미로에는 생성자(`userId`)가 기록되어 본인이 만든 미로만 삭제할 수 있습니다.

---

<div align="center">

React · TypeScript · Next.js · Neon 으로 제작되었습니다.

</div>
