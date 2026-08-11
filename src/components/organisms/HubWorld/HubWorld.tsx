'use client';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useGameStore } from '@state/game/store';
import { type GameState, type MazeLike } from '@game/mazeEngine';
import type { RenderOptions } from '@game/renderer';
import type { HubMap, Portal } from '@game/hubs';
import useArcadeInput from '@hooks/useArcadeInput';
import useGameLoop from '@hooks/useGameLoop';
import AxisFlipButtons from '@components/molecules/AxisFlipButtons';
import VirtualJoystick from '@components/molecules/VirtualJoystick';

import * as s from './HubWorld.css';

export interface HubWorldProps {
  hub: HubMap;
  /** 화면 아래에 띄울 안내. */
  hint?: string;
}

/** 입구 위에 올라섰다고 볼 거리(셀). 스치듯 지나가면 반응하지 않는다. */
const ENTER_DIST = 0.45;

/**
 * 메뉴를 게임 엔진으로 돌리는 화면. 캐릭터를 걸어서 입구에 올라서면 그곳으로
 * 들어간다. 이동과 시점 전환을 메뉴에서 자연스럽게 익히게 하는 것이 목적이다.
 */
const HubWorld: FC<HubWorldProps> = ({ hub, hint }) => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState<Portal | null>(null);

  const init = useGameStore((st) => st.init);
  const mode = useGameStore((st) => st.mode);
  const previewAxis = useGameStore((st) => st.previewAxis);
  const requestFlip = useGameStore((st) => st.requestFlip);

  // 허브도 엔진에게는 그냥 미로다. 도착점은 쓰지 않으므로 판 밖에 둔다.
  const maze: MazeLike = useMemo(
    () => ({
      mazeData: hub.mazeData,
      start: hub.start,
      end: { x: -1, y: -1 },
    }),
    [hub],
  );

  const optionsRef = useRef<RenderOptions>({});
  useEffect(() => {
    optionsRef.current = {
      previewAxis,
      portals: hub.portals,
      activePortal: active?.at ?? null,
    };
  }, [previewAxis, hub.portals, active]);

  useEffect(() => {
    init({
      title: '',
      name: '',
      mazeSize: { rows: hub.mazeData.length, cols: hub.mazeData[0].length },
      mazeData: hub.mazeData,
      start: hub.start,
      end: { x: -1, y: -1 },
    });
  }, [hub, init]);

  // 한 번 이동을 시작하면 라우팅이 끝날 때까지 다시 트리거하지 않는다
  const enteredRef = useRef(false);
  const onFrame = useCallback(
    (state: GameState) => {
      if (enteredRef.current) return;
      let found: Portal | null = null;
      for (const portal of hub.portals) {
        const dist = Math.hypot(
          state.pos.x - (portal.at.x + 0.5),
          state.pos.y - (portal.at.y + 0.5),
        );
        if (dist <= ENTER_DIST) {
          found = portal;
          break;
        }
      }
      setActive((prev) => (prev?.href === found?.href ? prev : found));
      if (found) {
        enteredRef.current = true;
        router.push(found.href);
      }
    },
    [hub.portals, router],
  );

  // 플레이 화면과 같은 조작 — 허브에서 익힌 그대로 스테이지에서 쓰게 한다
  const { getInput, onJoystick } = useArcadeInput(requestFlip);

  useGameLoop({ maze, canvasRef, getInput, optionsRef, onFrame });

  return (
    <div className={s.wrap}>
      <div className={s.stage}>
        <canvas ref={canvasRef} className={s.canvas} aria-label="허브" />
        <div className={s.hud}>
          <span className={s.badge} data-mode={mode}>
            {mode === 'side' ? 'SIDE' : 'TOP'}
          </span>
        </div>
        {active && <p className={s.entering}>{active.label} 로 들어갑니다…</p>}
      </div>

      <div className={s.deck}>
        <VirtualJoystick onChange={onJoystick} />
        <p className={s.hint}>{hint ?? '입구로 걸어가면 들어갑니다.'}</p>
        <AxisFlipButtons />
      </div>
    </div>
  );
};

export default HubWorld;
