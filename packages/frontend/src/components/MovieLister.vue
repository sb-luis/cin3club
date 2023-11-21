<script setup>
import { LoopingRhombusesSpinner } from 'epic-spinners';
import TwInput from './base/TwInput.vue';
import MovieListerCard from './MovieListerCard.vue';
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useMovieStore } from '../stores/MovieStore';
import debounce from 'lodash.debounce';
import { useRoute } from 'vue-router';

const route = useRoute();
const movieStore = useMovieStore();
const { searchQuery, searchQueryError } = storeToRefs(movieStore);

const getMoviesDebounced = debounce(async () => {
  await movieStore.getMovies();
}, 1000);

const debounceValidation = debounce(async () => {
  movieStore.validateQuery();
}, 300);

watch(searchQuery, () => {
  // some more stuff
  movieStore.isLoading = true;
  movieStore.searchQueryError = '';
  debounceValidation();
  getMoviesDebounced();
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
      <p class="text-center text-2xl text-red-500">
        {{ searchQueryError }}
      </p>
      <ul v-if="movieStore.movies?.length && !movieStore.isLoading">
        <MovieListerCard class="my-5" v-for="movie in movieStore.movies" :movie="movie"> </MovieListerCard>
      </ul>
      <LoopingRhombusesSpinner
        v-else-if="movieStore.isLoading && !searchQueryError"
        class="m-auto mt-6"
        :animation-duration="5000"
        :size="48"
      />
      <p v-else-if="!searchQueryError" class="text-center text-2xl">{{ $t('pages.movies.welcomeMessage') }}</p>
    </div>
  </div>
</template>

<style scoped></style>
