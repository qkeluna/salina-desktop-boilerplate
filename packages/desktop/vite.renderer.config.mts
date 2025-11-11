import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import babel from '@rollup/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-vite-plugin';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      plugins: ['babel-plugin-react-compiler'],
      include: ['src/**/*'],
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@salina/shared': path.resolve(__dirname, '../shared'),
      '@salina/ui': path.resolve(__dirname, '../ui'),
      '@salina/infrastructure': path.resolve(__dirname, '../infrastructure'),
      '@salina/domains-notes': path.resolve(__dirname, '../domains/notes'),
      '@salina/domains-files': path.resolve(__dirname, '../domains/files'),
      '@salina/domains-transcriptions': path.resolve(__dirname, '../domains/transcriptions'),
      '@salina/domains-search': path.resolve(__dirname, '../domains/search'),
      '@salina/domains-home': path.resolve(__dirname, '../domains/home'),
    },
  },
});
