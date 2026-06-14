const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

// Keep in sync with the path aliases in tsconfig.json.
// Required so `jest.mock('@alias/...')` calls resolve correctly.
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverage: true,
  moduleNameMapper: {
    '^@api/(.*)$': '<rootDir>/src/api/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@templates/(.*)$': '<rootDir>/src/components/templates/$1',
    '^@type/(.*)$': '<rootDir>/src/types/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@state/(.*)$': '<rootDir>/src/state/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@mock/(.*)$': '<rootDir>/src/mock/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@server/(.*)$': '<rootDir>/src/server/$1',
  },
}

module.exports = createJestConfig(customJestConfig)

