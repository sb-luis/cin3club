<script setup>
import { onMounted } from 'vue';
import { useMainStore } from './stores/MainStore';
import { useRoute } from 'vue-router';

const mainStore = useMainStore();
const route = useRoute();

onMounted(async () => {
  console.log('App mounted');
  mainStore.applyTheme();
});
</script>

<template>
  <RouterView />
</template>
