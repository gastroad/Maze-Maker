import next from 'eslint-config-next';

// eslint-config-next v16 은 flat config 배열을 직접 export 한다.
const eslintConfig = [
  {
    // .claude/**: 에이전트 워크트리 사본(.gitignore 와 동일 대상)까지 린트하면
    // 같은 파일의 에러가 중복 보고된다.
    ignores: [
      '.next/**',
      'node_modules/**',
      'coverage/**',
      'drizzle/**',
      '.claude/**',
    ],
  },
  ...next,
];

export default eslintConfig;
