import { Config } from 'jest';

const config: Config = {
  rootDir: './',

  preset: 'ts-jest',

  testEnvironment: 'node',

  testMatch: ['**/test/**/*.test.ts'],

  testPathIgnorePatterns: ['/node_modules/'],

  moduleNameMapper: {}
};

export default config;
