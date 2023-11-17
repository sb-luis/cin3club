<script setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/AuthStore';

const authStore = useAuthStore();
const { credentials } = storeToRefs(authStore);
</script>

<template>
  <nav class="flex justify-around max-w-xl m-auto space-x-6">
    <RouterLink to="/">home</RouterLink>
    <template v-if="credentials">
      <RouterLink to="/movies">movies</RouterLink>
      <RouterLink to="/requests">requests</RouterLink>
      <RouterLink to="/profile">profile</RouterLink>
    </template>
    <template v-if="!credentials">
      <RouterLink to="/login">login</RouterLink>
      <RouterLink to="/register">register</RouterLink>
    </template>
    <template v-else>
      <RouterLink to="/" @click="authStore.logout">logout</RouterLink>
    </template>
  </nav>
</template>
