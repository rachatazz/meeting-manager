/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig.test.json",
    },
  },
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^@shared/(.*)$": "<rootDir>/../../packages/shared/src/$1",
  },
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.ts", "!src/server.ts"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = config;
