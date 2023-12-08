// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */

const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { sourceMaps: 'inline' }],
  },
  // UUID package requires transformation... usually node_modules ignored
  transformIgnorePatterns: ['/node_modules/(?!(uuid)/)'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  moduleNameMapper: {
    // kbar: '<rootDir>/__mocks__/kbar.ts',
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>/../',
    }),
    'frontend/common/src': ['<rootDir>/common/src'],
    'frontend/system/src': ['<rootDir>/system/src'],
    'frontend/config/src': ['<rootDir>/config/src'],
    '.+\\.(gif)$': 'jest-transform-stub',
  },
};
