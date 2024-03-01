module.exports = {
  env: { es2021: true, node: true },
  // Keep prettier last to avoid conflicts with other rules
  extends: [
    'eslint:recommended',
    'airbnb/base',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    // Suppress import errors when linting typescript files ("missing .ts extension")
    'import/extensions': 'off',

    // Allow console.log
    'no-console': 'off',

    // Disables the need to use "default export" in files
    'import/prefer-default-export': 'off',

    // Disallow using "ISomeInterface" as a type name
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'typeLike',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: false,
        },
      },
    ],

    // Fixes a ts enum error: https://stackoverflow.com/questions/63961803/eslint-says-all-enums-in-typescript-app-are-already-declared-in-the-upper-scope
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'warn',
  },

  settings: {
    'import/resolver': {
      node: { extensions: ['.js', '.ts'] },
    },
  },
};
