<script setup>
import Navigation from '../components/Navigation.vue';
import { routes } from '../routes';
import { useAuthStore } from '../stores/AuthStore';

const authStore = useAuthStore();

const date = new Date();
const year = date.getFullYear();
</script>

<template>
  <header>
    <h1>{{ $t('app.title') }}</h1>
    <Navigation />
  </header>

  <main>
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :key="route.path" />
    </router-view>
  </main>

  <footer>
    <p>{{ $t('footer.license') }}</p>
    <p>{{ $t('footer.copyright', { year }) }}</p>
  </footer>
</template>

<style>
header {
  text-align: center;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin-bottom: 0.5rem;
}
</style>
