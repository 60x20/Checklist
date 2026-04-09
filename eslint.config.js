import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

// non-forwards-compatible plugins
import { fixupPluginRules } from '@eslint/compat';
// @ts-expect-error no-types
import filenames from 'eslint-plugin-filenames';

export default tseslint.config({
  extends: [
    js.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    reactHooks.configs.flat['recommended-latest'],
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    curly: ['error', 'multi-or-nest'], // for simplicity avoid blocks for single statements, but allow them for complex ones
    'func-style': ['error', 'declaration'], // function declarations are clearer and hoistable
    'prefer-arrow-callback': 'error', // arrow-callbacks are simpler than function expressions
    'no-restricted-syntax': ['error', 'TSTupleType > :not(TSNamedTupleMember)'], // naming clears ambiguity
    'filenames/match-exported': 'error', // default exports should match filename for readability
    /* turn off since too annoying */
    '@typescript-eslint/no-misused-promises': [
      'error',
      { checksVoidReturn: false },
    ],
  },
  files: ['src/**/*.{ts,tsx}', 'scripts/*.ts', './*.{js,ts}'],
  languageOptions: {
    ecmaVersion: 2020,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    filenames: fixupPluginRules(filenames),
  },
});
