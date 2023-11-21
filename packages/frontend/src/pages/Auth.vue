<script setup>
import TwInput from '../components/base/TwInput.vue';
import TwButton from '../components/base/TwButton.vue';
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
  <form class="flex flex-col items-center" @submit.prevent="handleAuth">
    <div class="">
      <label for="alias" class="hidden">{{ $t(`pages.${authPage}.aliasLabel`) }}</label>
      <TwInput
        v-model="alias"
        type="text"
        id="alias"
        name="alias"
        :placeholder="$t(`pages.${authPage}.aliasPlaceholder`)"
        required
      />
    </div>
    <div class="mt-2">
      <label for="password" class="hidden">{{ $t(`pages.${authPage}.passwordLabel`) }}</label>
      <TwInput
        v-model="password"
        type="password"
        id="password"
        name="password"
        :placeholder="$t(`pages.${authPage}.passwordPlaceholder`)"
        required
      />
    </div>
    <TwButton class="mt-2">
      {{ $t(`pages.${authPage}.submitButton`) }}
    </TwButton>
  </form>
</template>

<style scoped></style>
