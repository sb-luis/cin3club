<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './stores/AuthStore';
import { useMainStore } from './stores/MainStore';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const mainStore = useMainStore();
const route = useRoute();

onMounted(async () => {
  console.log('App mounted');

  if (!authStore.credentials) {
    // If we're accessing a protected route
    // The app will be mounted after we were redirected to the 'login' page
    const entryPath = route.redirectedFrom?.fullPath ?? route.fullPath;

    // Try loading the credentials
    await authStore.loadCredentials(entryPath);
  }

  mainStore.applyTheme();
});
</script>

<template>
  <RouterView />
</template>
