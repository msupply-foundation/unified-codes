module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    '../.eslintrc.js',
    'plugin:jest-dom/recommended',
    'plugin:react/recommended',
  ],
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      plugins: ['react', 'prettier'],
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },

  settings: { react: { version: 'detect' } },
  plugins: ['react'],
  rules: {
    'react/display-name': 'off',
    'react/prop-types': 'off',
  },
  ignorePatterns: ['**/operations.generated.ts', '**/*.js'],
};
