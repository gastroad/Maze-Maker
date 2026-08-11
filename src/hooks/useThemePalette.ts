'use client';
import { RefObject, useEffect, useRef, useState } from 'react';

import { readPalette, type Palette } from '@game/renderer';

export interface ThemePalette {
  /** 최신 팔레트. 그리기 직전에 `.current` 를 읽는다. */
  paletteRef: RefObject<Palette | null>;
  /**
   * 테마가 바뀔 때마다 증가한다. 다시 그리기 effect 의 의존성에 넣어 쓴다.
   * `rerenderOnChange` 를 켜지 않으면 언제나 0 이다.
   */
  themeTick: number;
}

/**
 * 캔버스에 쓸 테마 색을 읽고, <html> 의 클래스/data-theme 이 바뀌면 다시 읽는다.
 * 색은 CSS 변수에 있어서 컴포넌트가 직접 계산할 수 없다.
 *
 * 팔레트는 언제나 ref 로만 준다. 캔버스는 React 가 그리는 것이 아니라서
 * 색이 state 일 이유가 없기 때문이다.
 *
 * @param rerenderOnChange 테마가 바뀌었을 때 리렌더를 일으킬지.
 *   한 번 그리고 마는 캔버스(MazeCanvas·SlicePreview)는 다시 그릴 계기가 필요해
 *   켜고, 매 프레임 스스로 다시 그리는 게임 루프는 리렌더가 순수한 낭비라 끈다.
 */
export default function useThemePalette(
  rerenderOnChange = false,
): ThemePalette {
  const paletteRef = useRef<Palette | null>(null);
  const [themeTick, setThemeTick] = useState(0);

  useEffect(() => {
    const refresh = () => {
      paletteRef.current = readPalette(document.documentElement);
      if (rerenderOnChange) setThemeTick((t) => t + 1);
    };
    refresh();
    const mo = new MutationObserver(refresh);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });
    return () => mo.disconnect();
  }, [rerenderOnChange]);

  return { paletteRef, themeTick };
}
