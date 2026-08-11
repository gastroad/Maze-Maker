'use client';
import { FC, useState } from 'react';

import { darkTheme, lightTheme } from '@styles/theme.css';

import * as s from './ThemeToggle.css';

type Mode = 'light' | 'dark';

/** 서버에는 document 가 없으므로 인라인 스크립트와 같은 기본값('dark')으로 떨어진다. */
const readMode = (): Mode => {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.getAttribute('data-theme') === 'light'
    ? 'light'
    : 'dark';
};

/**
 * <html>의 테마 클래스를 토글한다. 초기 클래스는 layout 의 인라인 스크립트가
 * FOUC 없이 심어두며(localStorage/시스템 선호), 여기서는 그 값을 읽어 스위칭한다.
 *
 * 인라인 스크립트가 첫 페인트 전에 data-theme 을 확정하므로 effect 로 뒤늦게 읽지 않고
 * 최초 렌더에서 바로 읽는다. 다만 서버는 사용자의 테마를 알 수 없어 렌더 결과가 항상
 * 'dark' 기준이므로, 화면에 보이는 아이콘은 state 가 아니라 CSS 가 data-theme 으로
 * 고르게 두어 하이드레이션 불일치 자체를 없앴다(ThemeToggle.css.ts 참고).
 */
const ThemeToggle: FC = () => {
  const [mode, setMode] = useState<Mode>(readMode);

  const toggle = () => {
    const next: Mode = mode === 'dark' ? 'light' : 'dark';
    const el = document.documentElement;
    el.classList.remove(darkTheme, lightTheme);
    el.classList.add(next === 'dark' ? darkTheme : lightTheme);
    el.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {}
    setMode(next);
  };

  return (
    <button
      className={s.toggle}
      onClick={toggle}
      aria-label="테마 전환"
      title="테마 전환"
    >
      <span className={s.icon} aria-hidden="true" />
    </button>
  );
};

export default ThemeToggle;
