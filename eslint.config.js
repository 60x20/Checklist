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
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/consistent-type-exports': 'error',
    ...reactHooks.configs.recommended.rules,
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
  plugins: {
    'react-hooks': reactHooks,
  },
});
