<script setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import debounce from 'lodash.debounce';

import MediaItemDetailsCard from '../components/MediaItemDetailsCard.vue';

import { useMainStore } from '../stores/MainStore';
import { useMediaStore } from '../stores/MediaStore';

const mediaStore = useMediaStore();
const mainStore = useMainStore();
const route = useRoute();

const getMovieDetailsDebounced = debounce(async () => {
  mediaStore.getMediaItemDetails(route.params.id, route.meta.mediaType);
}, 1000);

onMounted(() => {
  mediaStore.selectedMediaItem = {};
  getMovieDetailsDebounced();
});

watch(
  () => mainStore.lang,
  () => {
    // re-fetch movie details if language changes
    mediaStore.isLoading = true;
    getMovieDetailsDebounced();
  },
);
</script>

<template>
  <section>
    <h1 class="text-primary-900 text-2xl font-bold uppercase">
      {{ $t(`pages.${route.meta.mediaType}Details.title`) }}
    </h1>
    <MediaItemDetailsCard tv />
  </section>
</template>

<style scoped></style>
