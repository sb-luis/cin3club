<script setup>
import { computed } from 'vue';
import { useMainStore } from '../stores/MainStore';
import { useMediaStore } from '../stores/MediaStore';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const dateStrToYear = (str) => {
  const d = new Date(str);
  return d.getFullYear();
};

const fullPosterUrl = (path) => {
  return `https://image.tmdb.org/t/p/w220_and_h330_face${path}`;
};

// item.originalTitle
// item.releaseYear
</script>

<template>
  <img
    v-if="item"
    :src="fullPosterUrl(item.posterPath)"
    class="ml-2 w-[150px] rounded-2xl bg-red-200 object-contain shadow-sm md:w-[200px]"
  />
</template>
