'use client';
import { FC, useEffect, useState } from 'react';

import { darkTheme, lightTheme } from '@styles/theme.css';

import * as s from './ThemeToggle.css';

type Mode = 'light' | 'dark';

/**
 * <html>의 테마 클래스를 토글한다. 초기 클래스는 layout 의 인라인 스크립트가
 * FOUC 없이 심어두며(localStorage/시스템 선호), 여기서는 그 값을 읽어 스위칭한다.
 */
const ThemeToggle: FC = () => {
  const [mode, setMode] = useState<Mode>('dark');

  useEffect(() => {
    const cur = document.documentElement.getAttribute('data-theme');
    if (cur === 'light' || cur === 'dark') setMode(cur);
  }, []);

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
      aria-label={mode === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
      title="테마 전환"
    >
      <span className={s.icon}>{mode === 'dark' ? '☀️' : '🌙'}</span>
    </button>
  );
};

export default ThemeToggle;
