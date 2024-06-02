import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "\\.(gif|ttf|eot|png)$": "<rootDir>/test/__mocks__/fileMock.js",
    "\\.(css|less)$": "<rootDir>/test/__mocks__/styleMock.js",
    "\\.svg$": "<rootDir>/test/__mocks__/svgMock.js",
  },
  automock: false,
  resetMocks: false,
  setupFiles: ['jest-localstorage-mock', '<rootDir>/jestSetup.ts'],
};

export default config;
