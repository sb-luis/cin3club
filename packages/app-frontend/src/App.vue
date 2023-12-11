<script setup>
import { onMounted } from 'vue';
import { useMainStore } from './stores/MainStore';

const mainStore = useMainStore();

onMounted(() => {
  console.log('App mounted');
  mainStore.applyTheme();
});
</script>

<template>
  <RouterView />
</template>
