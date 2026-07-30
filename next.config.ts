import type { NextConfig } from 'next';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
import bundleAnalyzer from '@next/bundle-analyzer';

// Next 16(Turbopack)에서 vanilla-extract(.css.ts) 처리. auto 모드가 Turbopack 규칙을 자동 등록.
const withVanillaExtract = createVanillaExtractPlugin({
  unstable_turbopack: { mode: 'auto' },
});

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
});

const nextConfig: NextConfig = {};

export default withBundleAnalyzer(withVanillaExtract(nextConfig));
