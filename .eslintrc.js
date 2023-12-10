module.exports = {
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 18,
    sourceType: 'module',
  },

  plugins: ['@typescript-eslint'],
  rules: {
    camelcase: ['error', { allow: ['_ONLY_FOR_TESTING'] }],
    'require-jsdoc': 0,
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-empty-function': 'off',
    'spaced-comment': [
      'error',
      'always',
      { markers: ['#', '/'], exceptions: ['-'] },
    ],
  },
  ignorePatterns: ['**/operations.generated.ts', '**/*.js'],
};
