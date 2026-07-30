import React from 'react';
import { vi } from 'vitest';

// jest-dom 매처를 Vitest 의 expect 에 등록 (toBeInTheDocument 등)
import '@testing-library/jest-dom/vitest';

// next/image: 정적 import 가 vite 에선 URL 문자열로 오므로, next 전용 props 를 걷어내고
// 평범한 <img> 로 렌더하도록 전역 모킹한다.
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, priority, sizes, loader, quality, ...rest }: any) =>
    React.createElement('img', {
      src: typeof src === 'object' && src ? src.src : src,
      alt,
      ...rest,
    }),
}));
