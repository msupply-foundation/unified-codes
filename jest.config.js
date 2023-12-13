// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */

module.exports = {
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  testEnvironment: 'node',
  preset: 'ts-jest',
};
