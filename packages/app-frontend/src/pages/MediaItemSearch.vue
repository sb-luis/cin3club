<script setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import debounce from 'lodash.debounce';
import { LoopingRhombusesSpinner } from 'epic-spinners';

import TwInput from '../components/base/TwInput.vue';
import MediaItemListerCard from '../components/MediaItemListerCard.vue';

import { useMediaStore } from '../stores/MediaStore';

const route = useRoute();
const mediaStore = useMediaStore();
const { searchQuery, searchQueryError } = storeToRefs(mediaStore);

const getMediaItemsDebounced = debounce(async () => {
  await mediaStore.getMediaItems();
}, 1000);

const debounceValidation = debounce(async () => {
  mediaStore.validateQuery();
}, 300);

watch(searchQuery, () => {
  // some more stuff
  mediaStore.isLoading = true;
  mediaStore.searchQueryError = '';
  debounceValidation();
  getMediaItemsDebounced();
});

onMounted(() => {
  console.log('MediaItemSearch page mounted');
  // Grab initial state from URL
  if (route.query.s) {
    mediaStore.searchQuery = route.query.s;
  }
});
</script>

<template>
  <section>
    <h1 class="text-primary-900 mb-5 text-2xl font-bold uppercase">{{ $t(`pages.mediaItemSearch.title`) }}</h1>
    <div>
      <label for="movie_query" class="hidden">{{ $t('pages.mediaItemSearch.searchLabel') }}</label>
      <TwInput
        v-model="searchQuery"
        class="w-full"
        type="text"
        id="first_name"
        :placeholder="$t('pages.mediaItemSearch.searchPlaceholder')"
      />
    </div>
    <div class="m-auto py-4">
      <p v-if="searchQueryError" class="text-center text-2xl text-red-500">
        {{ searchQueryError }}
      </p>
      <LoopingRhombusesSpinner
        v-else-if="mediaStore.isLoading"
        class="m-auto mt-6"
        :animation-duration="5000"
        :size="48"
      />
      <ul v-else-if="mediaStore.searchItems?.length && !mediaStore.isLoading">
        <MediaItemListerCard class="my-5" v-for="item in mediaStore.searchItems" :item="item"> </MediaItemListerCard>
      </ul>
      <p v-else-if="searchQuery !== ''" class="text-center text-2xl text-red-500">
        {{ $t('pages.mediaItemSearch.movieNotFound', { query: searchQuery }) }}
      </p>
      <p v-else class="text-center text-2xl">{{ $t('pages.mediaItemSearch.welcomeMessage') }}</p>
    </div>
  </section>
</template>

<style scoped></style>
