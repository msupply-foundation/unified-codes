const baseConfig = require('../jest.config');

module.exports = {
  ...baseConfig,
  projects: [
    {
      displayName: 'unit',
      testPathIgnorePatterns: ['integration'],
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/**/integration/**/*.test.ts'],
    },
  ],
};
