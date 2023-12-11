<script setup>
import NavBar from '../components/NavBar.vue';
import { onMounted } from 'vue';

const date = new Date();
const year = date.getFullYear();

onMounted(() => {
  console.log('Layout mounted');
});
</script>

<template>
  <div class="relative h-screen overflow-y-scroll antialiased">
    <div class="m-auto flex h-full flex-col items-center justify-stretch px-3 py-2">
      <!-- HEADER -->
      <header class="relative w-full">
        <!-- NAVBAR -->
        <NavBar />
      </header>

      <!-- MAIN -->
      <main class="relative mt-14 w-full max-w-4xl flex-1">
        <router-view v-slot="{ Component, route }">
          <component :is="Component" :key="route.path" />
        </router-view>
      </main>

      <!-- FOOTER -->
      <footer class="py-6 text-center text-xs text-neutral-400">
        <p>{{ $t('app.footer.license') }}</p>
        <p>{{ $t('app.footer.copyright', { year }) }}</p>
      </footer>
    </div>
  </div>
</template>

<style></style>
