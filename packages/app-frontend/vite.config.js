import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://kino-app.onrender.com/' : 'http://localhost:3000/';

console.log('Printing Base URL');
console.log(BASE_URL);

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
