<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/AuthStore';

const authStore = useAuthStore();

const alias = ref();
const password = ref();

const props = defineProps({
  authPage: {
    type: String,
    required: true,
  },
});

const handleAuth = async (event) => {
  if (props.authPage === 'login') {
    authStore.login(alias.value, password.value);
  } else if (props.authPage === 'register') {
    authStore.register(alias.value, password.value);
  }
};
</script>

<template>
  <html>
    <head>
      <title>{{ $t(`pages.${authPage}.title`) }}</title>
    </head>
    <body>
      <h3>{{ $t(`pages.${authPage}.title`) }}</h3>

      <form @submit.prevent="handleAuth">
        <div>
          <label for="alias" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
            $t(`pages.${authPage}.aliasLabel`)
          }}</label>
          <input
            v-model="alias"
            type="text"
            id="alias"
            name="alias"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            :placeholder="$t(`pages.${authPage}.aliasPlaceholder`)"
            required
          />
        </div>
        <div class="mt-2">
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
            $t(`pages.${authPage}.passwordLabel`)
          }}</label>
          <input
            v-model="password"
            type="password"
            id="password"
            name="password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            :placeholder="$t(`pages.${authPage}.passwordPlaceholder`)"
            required
          />
        </div>
        <button class="mt-3 p-1 rounded bg-green-800" type="submit">
          {{ $t(`pages.${authPage}.submitButton`) }}
        </button>
      </form>
    </body>
  </html>
</template>

<style scoped></style>
