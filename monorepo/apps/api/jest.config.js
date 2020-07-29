module.exports = {
  name: 'api',
  preset: '../../jest.config.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
      allowJs: 'true'
    }
  },
  coverageDirectory: '../../coverage/apps/api',
};