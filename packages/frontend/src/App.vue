<script setup>
import { useMainStore } from './stores/MainStore';
import { useAuthStore } from './stores/AuthStore';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const mainStore = useMainStore();
const route = useRoute();

onMounted(() => {
  authStore.loadCredentials();
  mainStore.setLang(route.query.lang);
});
</script>

<template>
  <RouterView />
</template>
