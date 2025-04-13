import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @ts-expect-error @see {@link https://github.com/facebook/react/issues/30119} */
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config({
  extends: [
    js.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    reactHooks.configs['recommended-latest'],
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/consistent-type-exports': 'error',
    'func-style': ['error', 'declaration'],
  },
  files: ['src/**/*.{ts,tsx}'],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
