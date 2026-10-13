import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/main.jsx',
      name: 'LanyardBundle',
      formats: ['es', 'iife'],
      fileName: (format) => `lanyard.${format}.js`
    },
    rollupOptions: {
      output: {
        exports: 'named'
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
});
