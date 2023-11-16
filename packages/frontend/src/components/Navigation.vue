<script setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/AuthStore';

const authStore = useAuthStore();
const { credentials } = storeToRefs(authStore);
</script>

<template>
  <nav class="flex justify-around">
    <RouterLink class="p-2" to="/">home</RouterLink>
    <template v-if="credentials">
      <RouterLink class="p-2" to="/movies">movies</RouterLink>
      <RouterLink class="p-2" to="/requests">requests</RouterLink>
      <RouterLink class="p-2" to="/profile">profile</RouterLink>
    </template>
    <template v-if="!credentials">
      <RouterLink class="p-2" to="/login">login</RouterLink>
      <RouterLink class="p-2" to="/register">register</RouterLink>
    </template>
    <template v-else>
      <span class="p-2">Logged in as '{{ credentials }}'</span>
      <RouterLink class="p-2" to="/" @click="authStore.logout">logout</RouterLink>
    </template>
  </nav>
</template>

<style scoped></style>
