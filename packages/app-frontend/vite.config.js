import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    assetsDir: '.',
  },
  server: {
    port: 8000,
    hmr: { host: '0.0.0.0' },
  },
  plugins: [vue()],
});
