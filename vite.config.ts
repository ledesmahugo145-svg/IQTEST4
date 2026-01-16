import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [
    angular({
      tsconfig: './tsconfig.json',
    }),
  ],
  // This is crucial for GitHub Pages to work in a subdirectory
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    mainFields: ['module'],
  },
  define: {
    // Expose the API key to the client-side code
    'process.env.API_KEY': JSON.stringify(process.env['API_KEY'] || ''),
  }
});