module.exports = {
  name: 'data-service',
  preset: '../../jest.config.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  coverageDirectory: '../../coverage/apps/data-service',
  projects: ['<rootDir>/data-service'],
};
