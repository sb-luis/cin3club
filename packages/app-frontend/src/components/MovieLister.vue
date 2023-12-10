<script setup>
import { LoopingRhombusesSpinner } from 'epic-spinners';
import TwInput from './base/TwInput.vue';
import MediaItemCard from './MediaItemCard.vue';
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useMovieStore } from '../stores/MovieStore';
import debounce from 'lodash.debounce';
import { useRoute } from 'vue-router';

const route = useRoute();
const movieStore = useMovieStore();
const { searchQuery, searchQueryError } = storeToRefs(movieStore);

const getMediaItemsDebounced = debounce(async () => {
  await movieStore.getMediaItems();
}, 1000);

const debounceValidation = debounce(async () => {
  movieStore.validateQuery();
}, 300);

watch(searchQuery, () => {
  // some more stuff
  movieStore.isLoading = true;
  movieStore.searchQueryError = '';
  debounceValidation();
  getMediaItemsDebounced();
});

onMounted(() => {
  // Grab initial state from URL
  if (route.query.s) {
    movieStore.searchQuery = route.query.s;
  }
});
</script>

<template>
  <div>
    <h1 class="text-primary-900 mb-5 text-2xl font-bold uppercase">{{ $t(`pages.movies.title`) }}</h1>
    <div>
      <label for="movie_query" class="hidden">{{ $t('pages.movies.searchLabel') }}</label>
      <TwInput
        v-model="searchQuery"
        class="w-full"
        type="text"
        id="first_name"
        :placeholder="$t('pages.movies.searchPlaceholder')"
      />
    </div>
    <div class="m-auto py-4">
      <p v-if="searchQueryError" class="text-center text-2xl text-red-500">
        {{ searchQueryError }}
      </p>
      <LoopingRhombusesSpinner
        v-else-if="movieStore.isLoading"
        class="m-auto mt-6"
        :animation-duration="5000"
        :size="48"
      />
      <ul v-else-if="movieStore.searchItems?.length && !movieStore.isLoading">
        <MediaItemCard class="my-5" v-for="item in movieStore.searchItems" :item="item"> </MediaItemCard>
      </ul>
      <p v-else-if="searchQuery !== ''" class="text-center text-2xl text-red-500">
        {{ $t('pages.movies.movieNotFound', { query: searchQuery }) }}
      </p>
      <p v-else class="text-center text-2xl">{{ $t('pages.movies.welcomeMessage') }}</p>
    </div>
  </div>
</template>

<style scoped></style>
