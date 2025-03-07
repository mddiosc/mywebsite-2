import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import unusedImports from 'eslint-plugin-unused-imports'
import testingLibrary from 'eslint-plugin-testing-library'
import prettierPlugin from 'eslint-plugin-prettier'
import importPlugin from 'eslint-plugin-import'
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'
import vitestPlugin from 'eslint-plugin-vitest'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: prettierPlugin,
      'unused-imports': unusedImports,
      'testing-library': testingLibrary,
      import: importPlugin,
      'react-x': reactX,
      'react-dom': reactDom,
      vitest: vitestPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...reactX.configs['recommended-typescript'].rules,
      ...reactDom.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'import/order': [
        'warn',
        {
          alphabetize: {
            caseInsensitive: true,
            order: 'asc',
          },
          groups: ['builtin', 'external', 'sibling', 'parent'],
          'newlines-between': 'always',
          pathGroups: [
            {
              group: 'external',
              pattern: 'react*',
              position: 'before',
            },
            {
              group: 'external',
              pattern: 'react/**',
              position: 'before',
            },
            {
              group: 'external',
              pattern: '@testing-library/**',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
    },
  },
  {
    files: ['**/?(*.)+(spec|test).[jt]s?(x)'],
    plugins: {
      'testing-library': testingLibrary,
      vitest: vitestPlugin,
    },
    rules: {
      'testing-library/await-async-queries': 'error',
      'testing-library/no-await-sync-queries': 'error',
      'testing-library/no-debugging-utils': 'warn',
      'testing-library/render-result-naming-convention': 'error',
      'vitest/consistent-test-it': 'error',
      'vitest/expect-expect': 'error',
      'vitest/no-disabled-tests': 'warn',
      'vitest/no-focused-tests': 'error',
    },
  },
)
