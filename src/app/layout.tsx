import { Metadata, Viewport } from 'next';
import '../assets/style/reset.scss';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body id="body">{children}</body>
    </html>
  );
}
