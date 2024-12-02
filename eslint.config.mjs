import globals from "globals";
import pluginReact from 'eslint-plugin-react';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';



export default [
  {files: ['src/**/*.{js,ts,jsx,tsx}']},
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      'no-console': 'off',
      'no-magic-numbers': 'off',
      'quotes': ['error', 'single'],
      'semi': 'error',
      'sort-imports': 'off',
      'eqeqeq': 'error',

    },
  },
];