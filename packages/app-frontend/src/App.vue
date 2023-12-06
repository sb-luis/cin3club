<script setup>
import { onMounted } from 'vue';
import { useMainStore } from './stores/MainStore';

const mainStore = useMainStore();

onMounted(() => {
  mainStore.applyTheme();
});
</script>

<template>
  <RouterView />
</template>
