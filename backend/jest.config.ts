import { Config } from 'jest';

const config: Config = {
  rootDir: './',

  preset: 'ts-jest',

  testEnvironment: 'node',

  testMatch: ['**/test/**/*.test.ts'],

  testPathIgnorePatterns: ['/node_modules/'],

  moduleNameMapper: {},
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};

export default config;
