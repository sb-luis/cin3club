<script setup>
import NavBar from '../components/NavBar.vue';
import { routes } from '../routes';
import { useAuthStore } from '../stores/AuthStore';

const authStore = useAuthStore();

const date = new Date();
const year = date.getFullYear();
</script>

<template>
  <div class="w-full h-full z-10 relative">
    <div class="h-full py-3 px-6 m-auto flex flex-col items-center">
      <header class="text-center">
        <h1 class="text-8xl font-kaushan">{{ $t('app.title') }}</h1>
        <NavBar class="pt-2" />
      </header>

      <main class="flex-1 w-full max-w-5xl">
        <router-view v-slot="{ Component, route }">
          <component :is="Component" :key="route.path" />
        </router-view>
      </main>

      <footer class="py-6 text-xs text-center text-gray-500">
        <p>{{ $t('footer.license') }}</p>
        <p>{{ $t('footer.copyright', { year }) }}</p>
      </footer>
    </div>
  </div>
</template>
