<script setup>
import { useMainStore } from '../stores/MainStore';
import { useAuthStore } from '../stores/AuthStore';

const mainStore = useMainStore();
const authStore = useAuthStore();

const { path, query, replace } = defineProps({
  path: {
    type: String,
    require: true,
  },
  query: {
    type: Object,
    default: () => ({}),
  },
  replace: {
    type: Boolean,
    default: false,
  },
});

const handleNavigation = () => {
  if (path === '/logout') {
    authStore.logout();
    mainStore.navigate({ path: '/' });
  } else {
    mainStore.navigate({ path, query, replace });
  }
};
</script>

<template>
  <a
    class="hover:text-primary-900 cursor-pointer rounded-xl bg-neutral-200 p-2 text-center text-2xl hover:bg-neutral-300"
    @click="handleNavigation"
    ><slot></slot
  ></a>
</template>
