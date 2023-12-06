// main.js (shared between server and client)
// exports env-agnostic (universal) app code

import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import './assets/main.css';
import router from './routes';
import axios from 'axios';
import App from './App.vue';
import i18next from 'i18next';
import i18NextVue from 'i18next-vue';
import * as locales from './locales';

// SSR requires a fresh app instance per request, therefore we export a function that creates a fresh app instance. If using Pinia, we'd also be creating a fresh store here.
export function createApp(options = {}) {
  const app = createSSRApp(App);
  const { lang = 'en' } = options;

  // --- axios HTTP client ---
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    timeout: 10000, // 10s
  });
  app.config.globalProperties.$axios = axiosInstance;
  app.provide('$axios', axiosInstance);

  // --- i18n ---
  i18next.init({ lng: lang, resources: { ...locales } });

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

  return { app, router };
}
