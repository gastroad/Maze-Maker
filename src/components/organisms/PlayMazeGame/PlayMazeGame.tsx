'use client';
import { FC, useEffect, useMemo, useRef } from 'react';

import { useGameStore } from '@state/game/store';
import type { RenderOptions } from '@game/renderer';
import { toPathSteps } from '@utils/findPath';
import useArcadeInput from '@hooks/useArcadeInput';
import useGameLoop from '@hooks/useGameLoop';
import AxisFlipButtons from '@components/molecules/AxisFlipButtons';
import VirtualJoystick from '@components/molecules/VirtualJoystick';
import PlayResult from '@components/organisms/PlayResult';
import PlayMazeController from '@components/organisms/PlayMazeController';
import { MazeType } from '@type/maze';

import * as s from './PlayMazeGame.css';

export interface PlayMazeGameProps {
  maze: MazeType;
}
const PlayMazeGame: FC<PlayMazeGameProps> = ({ maze }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const init = useGameStore((st) => st.init);
  const status = useGameStore((st) => st.status);
  const mode = useGameStore((st) => st.mode);
  const z = useGameStore((st) => st.z);
  const notice = useGameStore((st) => st.notice);
  const setNotice = useGameStore((st) => st.setNotice);
  const showAnswer = useGameStore((st) => st.showAnswer);
  const requestFlip = useGameStore((st) => st.requestFlip);
  const previewAxis = useGameStore((st) => st.previewAxis);

  // 저장된 좌표에 높이·등반 여부를 붙여 둔다(선으로 긋고 전환 지점을 표시하기 위해)
  const path = useMemo(
    () => toPathSteps(maze.mazeData, maze.start, maze.resolvedPath ?? []),
    [maze.mazeData, maze.start, maze.resolvedPath],
  );
  const optionsRef = useRef<RenderOptions>({});
  useEffect(() => {
    optionsRef.current = {
      path: showAnswer ? path : undefined,
      previewAxis,
    };
  }, [showAnswer, path, previewAxis]);

  // 키보드(방향키·WASD·스페이스)와 가상 조이스틱 — 허브와 같은 조작이다
  const { getInput, onJoystick } = useArcadeInput(requestFlip);

  // 미로가 준비되면 새 게임 시작
  useEffect(() => {
    init(maze);
  }, [maze, init]);

  useGameLoop({ maze, canvasRef, getInput, optionsRef });

  // 안내 문구는 잠깐만 띄운다
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(null), 2200);
    return () => clearTimeout(id);
  }, [notice, setNotice]);

  return (
    <div className={s.wrap}>
      <div className={s.game}>
        <canvas ref={canvasRef} className={s.canvas} aria-label="미로" />
        <div className={s.hud}>
          <span className={s.badge} data-mode={mode}>
            {mode === 'side' ? 'SIDE' : 'TOP'}
          </span>
          {z > 0 && <span className={s.floor}>{z.toFixed(0)}층</span>}
        </div>
        {notice && <p className={s.notice}>{notice}</p>}
        {status === 'won' && <PlayResult />}
      </div>

      <div className={s.deck}>
        <VirtualJoystick onChange={onJoystick} />
        <p className={s.hint}>
          {mode === 'side'
            ? '← → 이동 · ↑ 점프'
            : '방향키 · WASD · 조이스틱으로 이동'}
        </p>
        <AxisFlipButtons />
        <PlayMazeController />
      </div>
    </div>
  );
};
export default PlayMazeGame;
