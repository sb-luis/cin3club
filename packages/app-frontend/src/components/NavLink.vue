<script setup>
import { useMainStore } from '../stores/MainStore';
import { useRoute } from 'vue-router';

const mainStore = useMainStore();
const route = useRoute();

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
  mainStore.navigate({ path, query, replace });
};
</script>

<template>
  <a
    class="hover:text-primary-900 cursor-pointer select-none rounded-xl bg-neutral-200 p-2 text-center hover:bg-neutral-300"
    :class="{ 'text-primary-900 font-bold': route.path === path }"
    @click="handleNavigation"
    ><slot></slot
  ></a>
</template>
