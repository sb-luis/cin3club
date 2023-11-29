import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const BACKEND_ENDPOINT =
  process.env.NODE_ENV === 'production' ? 'https://kino-app.onrender.com/' : 'http://localhost:3000/';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    base: BACKEND_ENDPOINT,
    port: 8000,
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
