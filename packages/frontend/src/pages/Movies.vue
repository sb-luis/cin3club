<script setup>
import { LoopingRhombusesSpinner } from 'epic-spinners';
import MovieListerCard from '../components/MovieListerCard.vue';
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useMovieStore } from '../stores/MovieStore';
import debounce from 'lodash.debounce';
import { useRoute } from 'vue-router';

const route = useRoute();
const movieStore = useMovieStore();
const { queryValue, queryError } = storeToRefs(movieStore);

const debounceApiCalls = debounce(async () => {
  await movieStore.getMovies();
}, 1000);

const debounceValidation = debounce(async () => {
  movieStore.validateQuery();
}, 300);

watch(queryValue, () => {
  // some more stuff
  movieStore.isLoading = true;
  movieStore.queryError = '';
  debounceValidation();
  debounceApiCalls();
});

onMounted(() => {
  // Grab initial query value from URL
  if (route.query.s) {
    movieStore.queryValue = route.query.s;
  }
});
</script>

<template>
  <div>
    <h1 class="text-4xl pt-2 pb-5">{{ $t('pages.movies.title') }}</h1>
    <div>
      <label for="movie_query" class="hidden">{{ $t('pages.movies.searchLabel') }}</label>
      <input
        v-model="queryValue"
        type="text"
        id="first_name"
        class="w-full p-3 text-2xl rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 text-white"
        :placeholder="$t('pages.movies.searchPlaceholder')"
        required
      />
    </div>
    <div class="m-auto py-4">
      <p class="text-red-500 text-center text-2xl">
        {{ queryError }}
      </p>
      <ul v-if="movieStore.movies?.length && !movieStore.isLoading">
        <MovieListerCard class="my-5" v-for="movie in movieStore.movies" :movie="movie"> </MovieListerCard>
      </ul>
      <LoopingRhombusesSpinner
        v-else-if="movieStore.isLoading && !queryError"
        class="mt-6 m-auto"
        :animation-duration="5000"
        :size="48"
      />
      <p v-else-if="!queryError" class="text-center text-2xl">{{ $t('pages.movies.welcomeMessage') }}</p>
    </div>
  </div>
</template>

<style scoped></style>
