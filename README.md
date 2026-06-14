<div align="center">

# 🧩 Maze Maker

**나만의 미로를 만들고, 직접 플레이하는 웹 게임**

미로를 그려 저장하고, 목록에서 골라 방향키로 플레이할 수 있습니다.
A\* 알고리즘으로 정답 경로를 자동으로 찾아줍니다.

<br/>

![Next.js](https://img.shields.io/badge/Next.js_13-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Recoil](https://img.shields.io/badge/Recoil-3578E5?style=flat-square&logo=recoil&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?style=flat-square&logo=sass&logoColor=white)
![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=flat-square&logo=storybook&logoColor=white)
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

---

## 🧰 기술 스택

- **프레임워크** — Next.js 13 (App Router) · React 18
- **언어** — TypeScript
- **상태 관리** — Recoil
- **데이터 패칭** — SWR · Next.js Route Handlers
- **스타일** — Sass(SCSS) + 디자인 토큰 기반 다크 테마
- **컴포넌트 설계** — Atomic Design
- **개발 도구** — Storybook · Jest · Testing Library · ESLint · Prettier

---

## 🚀 시작하기

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

### 그 외 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 (+ 번들 분석) |
| `npm start` | 프로덕션 서버 실행 |
| `npm run test:ci` | 테스트 1회 실행 |
| `npm test` | 테스트 watch 모드 |
| `npm run storybook` | Storybook 실행 (`:6006`) |
| `npm run lint` | ESLint 검사 |

---

## 🗂 프로젝트 구조

[Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) 패턴으로 컴포넌트를 단계별로 구성합니다.

```
src/
├── app/                  # 라우트 (App Router) · API Route Handlers
│   ├── maker/            #   미로 제작 페이지
│   ├── maplist/          #   미로 목록 · 플레이 페이지([id])
│   └── api/mazelist/     #   미로 CRUD API
├── components/           # UI 컴포넌트
│   ├── atoms/            #   Button, TextInput, MazeCell ...
│   ├── molecules/        #   MazeBoard, MazeListItem ...
│   ├── organisms/        #   PlayMazeGame, MakerMazeMaker ...
│   └── templates/        #   HomeTemplate, GameTemplate
├── server/               # 서버 전용 데이터 접근 (mazeStore)
├── state/                # Recoil atoms (game · maker)
├── hooks/                # 커스텀 훅
├── utils/                # findPath (A* 알고리즘)
├── types/                # 공용 타입 정의
└── assets/               # 스타일 토큰 · 이미지
```

---

## 🧠 핵심 동작

- **경로 탐색** — [`utils/findPath.ts`](src/utils/findPath.ts) 의 A\* 알고리즘이 맨해튼 거리 휴리스틱으로 최단 경로를 계산합니다.
- **상태 관리** — 제작(`state/maker`)과 플레이(`state/game`) 상태를 Recoil atom으로 분리해 관리합니다.
- **데이터 흐름** — 서버 컴포넌트는 `@server/mazeStore`로 데이터를 직접 읽고, 생성은 클라이언트에서 Route Handler(`/api/mazelist`)로 처리합니다. 미로 데이터는 `data.json`에 저장됩니다.

---

<div align="center">

React · TypeScript · Next.js 로 제작되었습니다.

</div>
