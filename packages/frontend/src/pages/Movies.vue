<script setup>
import MovieListerCard from '../components/MovieListerCard.vue';
import { ref, onMounted, watch, onUpdated } from 'vue';
import { storeToRefs } from 'pinia';
import { useMovieStore } from '../stores/MovieStore';
import { useRouter, useRoute } from 'vue-router';
import debounce from 'lodash.debounce';

const movieStore = useMovieStore();
const { queryValue, queryError } = storeToRefs(movieStore);

const router = useRouter();

const debouncedUpdate = debounce(async () => {
  await movieStore.getMovies();
}, 500);

watch(queryValue, () => {
  // some more stuff
  router.replace({ path: '/movies', query: { s: queryValue.value } });
  movieStore.isLoading = true;
  debouncedUpdate();
});
</script>

<template>
  <div>
    <h1 class="text-5xl pt-2 pb-5 uppercase">{{ $t('pages.movies.title') }}</h1>
    <div>
      <label for="movie_query" class="hidden">{{ $t('pages.movies.searchLabel') }}</label>
      <div class="relative">
        <input
          v-model="queryValue"
          type="text"
          id="first_name"
          class="w-full p-3 text-2xl rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
          :class="{ 'bg-red-500': queryError }"
          placeholder="John"
          required
        />
        <p class="text-red-200 absolute lowercase top-2.5 right-2.5">{{ queryError }}</p>
      </div>
    </div>
    <ul v-if="!movieStore.isLoading">
      <MovieListerCard class="my-5" v-for="movie in movieStore.movies" :movie="movie"> </MovieListerCard>
    </ul>
    <div v-else>Is loading</div>
  </div>
</template>

<style scoped></style>
