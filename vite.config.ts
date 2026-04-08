import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,   // escuta em 0.0.0.0 — acessível via IP local na rede
    proxy: {
      '/api': {
        target: 'http://localhost:8080',  // api-gateway
        changeOrigin: true,
      },
    },
  },
});
