import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores([
    'node_modules/',
    'dist/',
    'coverage/',
    'playwright-report/',
    'test-results/',
    'blob-report/',
    'playwright/.cache/',
    '.vite/',
    '.cache/',
    'package-lock.json',
  ]),
  {
    files: ['**/*.{js,mjs,ts}'],
    extends: [js.configs.recommended],
  },
  {
    files: ['**/*.ts'],
    extends: [tseslint.configs.recommended],
  },
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['*.config.{js,ts}', 'tools/**/*.mjs'],
    languageOptions: { globals: globals.node },
  },
  prettier,
);
