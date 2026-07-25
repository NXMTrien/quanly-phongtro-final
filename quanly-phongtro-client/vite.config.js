import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy API + uploaded images to the backend during dev
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
    },
  },
});
