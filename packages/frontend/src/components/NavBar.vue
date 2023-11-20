<script setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/AuthStore';
import { useMainStore } from '../stores/MainStore';

const authStore = useAuthStore();
const mainStore = useMainStore();
const { credentials } = storeToRefs(authStore);
</script>

<template>
  <nav class="flex text-lg justify-between w-[300px] m-auto space-x-6">
    <RouterLink :to="{ path: '/', query: { lang: mainStore.lang } }">movies</RouterLink>
    <RouterLink v-if="credentials" :to="{ path: '/ratings', query: { lang: mainStore.lang } }">ratings</RouterLink>
    <template v-if="!credentials">
      <RouterLink :to="{ path: '/login', query: { lang: mainStore.lang } }">login</RouterLink>
      <RouterLink :to="{ path: '/register', query: { lang: mainStore.lang } }">register</RouterLink>
    </template>
    <template v-else>
      <RouterLink :to="{ path: '/', query: { lang: mainStore.lang } }" @click="authStore.logout">logout</RouterLink>
    </template>
  </nav>
</template>
