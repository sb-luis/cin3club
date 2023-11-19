<script setup>
import NavBar from '../components/NavBar.vue';
import { useAuthStore } from '../stores/AuthStore';
import { useMainStore } from '../stores/MainStore';

const mainStore = useMainStore();

const authStore = useAuthStore();

const date = new Date();
const year = date.getFullYear();
</script>

<template>
  <div class="w-full h-full z-10 relative">
    <div class="h-full py-3 px-6 m-auto flex flex-col items-center">
      <header class="text-center w-full relative">
        <h1 class="text-8xl font-kaushan">{{ $t('app.title') }}</h1>
        <NavBar class="pt-2" />
        <!-- TOGGLE LOCALE -->
        <button @click="() => mainStore.toggleLang()" class="space-x-2 text-neutral-700 absolute top-2 right-2">
          <span :class="{ 'text-white': mainStore.lang === 'en-gb' }"> EN </span>
          <span>/</span>
          <span :class="{ 'text-white': mainStore.lang === 'es-spa' }"> ES </span>
        </button>
      </header>

      <main class="flex-1 w-full max-w-4xl">
        <router-view v-slot="{ Component, route }">
          <component :is="Component" :key="route.path" />
        </router-view>
      </main>

      <footer class="py-6 text-xs text-center text-gray-500">
        <p>{{ $t('app.footer.license') }}</p>
        <p>{{ $t('app.footer.copyright', { year }) }}</p>
      </footer>
    </div>
  </div>
</template>
