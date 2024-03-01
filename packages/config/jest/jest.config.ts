import type { Config } from 'jest';

export const unit = async (config?: Config): Promise<Config> => ({
  rootDir: './',
  displayName: '[Unit Test]',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['build'],
  transform: {
    '^.+\\.tsx?$': '@swc/jest',
  },
  ...config,
});
