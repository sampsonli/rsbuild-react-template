import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginLess } from '@rsbuild/plugin-less';
import * as path from 'node:path';


export default defineConfig({
  plugins: [pluginReact(), pluginLess()],
  output: {
    cleanDistPath: process.env.NODE_ENV === 'production',
  },
  html: {
    template: './src/index.html',
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  }
});
