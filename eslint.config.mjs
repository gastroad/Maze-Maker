import next from 'eslint-config-next';

// eslint-config-next v16 은 flat config 배열을 직접 export 한다.
const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'coverage/**', 'drizzle/**'],
  },
  ...next,
];

export default eslintConfig;
