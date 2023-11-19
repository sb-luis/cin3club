<script setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/AuthStore';
import { useMainStore } from '../stores/MainStore';

const authStore = useAuthStore();
const mainStore = useMainStore();
const { credentials } = storeToRefs(authStore);
</script>

<template>
  <nav class="flex justify-between max-w-xl m-auto space-x-6">
    <RouterLink :to="{ path: '/', query: { lang: mainStore.lang } }">home</RouterLink>
    <template v-if="credentials">
      <RouterLink :to="{ path: '/movies', query: { lang: mainStore.lang } }">movies</RouterLink>
      <RouterLink :to="{ path: '/me', query: { lang: mainStore.lang } }">profile</RouterLink>
    </template>
    <template v-if="!credentials">
      <RouterLink :to="{ path: '/login', query: { lang: mainStore.lang } }">login</RouterLink>
      <RouterLink :to="{ path: '/register', query: { lang: mainStore.lang } }">register</RouterLink>
    </template>
    <template v-else>
      <RouterLink :to="{ path: '/', query: { lang: mainStore.lang } }" @click="authStore.logout">logout</RouterLink>
    </template>
  </nav>
</template>
