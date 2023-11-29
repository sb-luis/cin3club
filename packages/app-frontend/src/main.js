import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './assets/main.css';
import router from './routes';
import axios from 'axios';

import App from './App.vue';
export const app = createApp(App);

// --- axios HTTP client ---
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  timeout: 10000, // 10s
});
app.config.globalProperties.$axios = axiosInstance;
app.provide('$axios', axiosInstance);

// --- i18n ---
import i18next from 'i18next';
import i18NextVue from 'i18next-vue';
import * as locales from './locales';
i18next.init({ lng: 'en', resources: { ...locales } });

// --- pinia store ---
const piniaStore = createPinia();
piniaStore
  .use(function () {
    return { $i18next: i18next };
  })
  .use(function () {
    return { $axios: axiosInstance };
  })
  .use(function () {
    return { $router: router };
  });

app.use(piniaStore).use(i18NextVue, { i18next }).use(router);

app.mount('#app');
