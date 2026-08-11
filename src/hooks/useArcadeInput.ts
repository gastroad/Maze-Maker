'use client';
import { useCallback, useEffect, useRef } from 'react';

import type { Input } from '@game/mazeEngine';

interface Keys {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

const NO_KEYS = (): Keys => ({
  up: false,
  down: false,
  left: false,
  right: false,
});

const KEY_MAP: Record<string, keyof Keys> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  a: 'left',
  s: 'down',
  d: 'right',
  W: 'up',
  A: 'left',
  S: 'down',
  D: 'right',
};

export interface ArcadeInput {
  /**
   * 게임 루프가 매 프레임 부르는 입력 소스.
   * useGameLoop 의 의존성 배열에 들어가므로 참조가 절대 바뀌면 안 된다 —
   * 바뀌는 순간 rAF 루프가 통째로 재시작된다.
   */
  getInput: () => Input;
  /** VirtualJoystick 의 onChange 에 그대로 넘긴다. */
  onJoystick: (v: { x: number; y: number }) => void;
}

/**
 * 아케이드 조작(키보드 + 가상 조이스틱)을 한 벌로 묶는다.
 * 플레이 화면과 허브가 완전히 같은 조작을 쓰므로 여기 한 곳에서만 관리한다.
 *
 * 입력은 state 가 아니라 ref 에 쌓는다. 키를 누를 때마다 리렌더하면 매 프레임
 * 도는 게임 루프에는 아무 의미 없는 렌더가 초당 수십 번 생긴다.
 *
 * @param onFlip 스페이스를 눌렀을 때(시점 전환). 반복 입력(e.repeat)은 무시한다.
 */
export default function useArcadeInput(onFlip: () => void): ArcadeInput {
  const keysRef = useRef<Keys>(NO_KEYS());
  const joyRef = useRef({ x: 0, y: 0 });

  // 리스너를 한 번만 붙이기 위해 콜백은 ref 로 최신값만 따라가게 둔다.
  const onFlipRef = useRef(onFlip);
  useEffect(() => {
    onFlipRef.current = onFlip;
  }, [onFlip]);

  // 키보드(불리언)가 우선, 눌린 키가 없으면 조이스틱(아날로그)
  const getInput = useCallback((): Input => {
    const k = keysRef.current;
    const kx = (k.down ? 1 : 0) - (k.up ? 1 : 0);
    const ky = (k.right ? 1 : 0) - (k.left ? 1 : 0);
    if (kx !== 0 || ky !== 0) return { x: kx, y: ky };
    return joyRef.current;
  }, []);

  const onJoystick = useCallback((v: { x: number; y: number }) => {
    joyRef.current = v;
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (!e.repeat) onFlipRef.current();
        return;
      }
      const k = KEY_MAP[e.key];
      if (k) {
        keysRef.current[k] = true;
        e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const k = KEY_MAP[e.key];
      if (k) keysRef.current[k] = false;
    };
    // 창을 벗어나면 keyup 이 오지 않아 키가 눌린 채로 굳는다
    const clear = () => {
      keysRef.current = NO_KEYS();
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clear);
    };
  }, []);

  return { getInput, onJoystick };
}
