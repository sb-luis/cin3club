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
  <div>
    <h3 class="text-4xl pt-2 py-5">{{ $t(`pages.${authPage}.title`) }}</h3>

    <form @submit.prevent="handleAuth">
      <div>
        <label for="alias" class="hidden">{{ $t(`pages.${authPage}.aliasLabel`) }}</label>
        <input
          v-model="alias"
          type="text"
          id="alias"
          name="alias"
          class="w-full p-3 mb-3 text-2xl rounded-lg bg-gray-700 autofill:bg-gray-700 border border-gray-600 placeholder-gray-400 text-white"
          :placeholder="$t(`pages.${authPage}.aliasPlaceholder`)"
          required
        />
      </div>
      <div class="mt-2">
        <label for="password" class="hidden">{{ $t(`pages.${authPage}.passwordLabel`) }}</label>
        <input
          v-model="password"
          type="password"
          id="password"
          name="password"
          class="w-full p-3 text-2xl rounded-lg bg-gray-700 autofill:bg-gray-700 border border-gray-600 placeholder-gray-400 text-white"
          :placeholder="$t(`pages.${authPage}.passwordPlaceholder`)"
          required
        />
      </div>
      <button class="mt-3 p-1 rounded bg-green-800" type="submit">
        {{ $t(`pages.${authPage}.submitButton`) }}
      </button>
    </form>
  </div>
</template>

<style scoped></style>
