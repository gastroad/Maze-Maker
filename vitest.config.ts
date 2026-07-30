import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // tsconfigPaths: @alias 경로 해석 / vanillaExtractPlugin: .css.ts 실제 컴파일
  plugins: [tsconfigPaths(), react(), vanillaExtractPlugin()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
    },
  },
});
