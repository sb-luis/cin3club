<script setup>
import { useAuthStore } from './stores/AuthStore';
import { onMounted } from 'vue';

const authStore = useAuthStore();

onMounted(() => {
  authStore.loadCredentials();
});
</script>

<template>
  <RouterView />
</template>
