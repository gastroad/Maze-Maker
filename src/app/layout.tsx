import { Metadata, Viewport } from 'next';

import { darkTheme, lightTheme } from '@styles/theme.css';
import ThemeToggle from '@components/atoms/ThemeToggle';

import '@styles/reset.css';

export const metadata: Metadata = {
  title: 'maze-maker',
  description: '미로를 만들고 플레이 해 볼수 있습니다.',
  robots: 'ALL',
  authors: { name: 'coldpotatosweet' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

// 첫 페인트 전에 테마 클래스를 심어 FOUC 방지 (localStorage → 시스템 선호 순)
const themeInit = `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;var e=document.documentElement;e.classList.add(d?'${darkTheme}':'${lightTheme}');e.setAttribute('data-theme',d?'dark':'light');}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body id="body">
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
