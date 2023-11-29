import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const BASE_URL = import.meta.env.MODE === 'production' ? 'https://kino-app.onrender.com/' : 'http://localhost:3000/';

// https://vitejs.dev/config/
export default defineConfig({
  base: BASE_URL,
  server: {
    port: 8000,
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
