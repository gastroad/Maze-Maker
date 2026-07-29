// jest-dom 매처를 런타임에 등록하고, 동시에 tsconfig(`**/*.ts`)에 포함되어
// `jest.Matchers`에 대한 타입 증강(toBeInTheDocument 등)을 TS에 로드한다.
import '@testing-library/jest-dom';
