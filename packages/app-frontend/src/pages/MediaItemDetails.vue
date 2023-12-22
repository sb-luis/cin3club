<script setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import debounce from 'lodash.debounce';

import MediaItemDetailsCard from '../components/MediaItemDetailsCard.vue';

import { useMainStore } from '../stores/MainStore';
import { useMediaStore } from '../stores/MediaStore';
import { useTranslation } from "i18next-vue";
import { useHead } from '@unhead/vue'

const mediaStore = useMediaStore();
const mainStore = useMainStore();
const route = useRoute();
const { t } = useTranslation();

const computeHead = () => {
  useHead({
    title: `${t('app.title')} | ${t('pages.' + route.meta.mediaType + 'Details.title')}`,
  });
};

computeHead();

const getMediaItemDetailsDebounced = debounce(async () => {
  mediaStore.getMediaItemDetails(route.params.id, route.meta.mediaType);
}, 1000);

onMounted(() => {
  console.log('Media Item Details mounted');
  mediaStore.selectedMediaItem = {};
  getMediaItemDetailsDebounced();
});

watch(
  () => mainStore.lang,
  () => {
    computeHead();
    // re-fetch movie details if language changes
    console.log('Language change triggered refetch of Media Item Details');
    mediaStore.selectedMediaItem = {};
    mediaStore.isLoading = true;
    getMediaItemDetailsDebounced();
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
