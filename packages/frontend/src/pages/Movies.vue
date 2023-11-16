<script setup>
import MovieListerCard from '../components/MovieListerCard.vue';
import { onMounted } from 'vue';
import { useMovieStore } from '../stores/MovieStore';

const movieStore = useMovieStore();

onMounted(() => {
  movieStore.getMovies();
});
</script>

<template>
  <div>
    <h1>{{ $t('pages.movies.title') }}</h1>
    <div>
      <label
        for="movie_query"
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >{{ $t('pages.movies.searchLabel') }}</label
      >
      <input
        type="text"
        id="first_name"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="John"
        required
      />
    </div>
    <ul>
      <MovieListerCard class="my-5" v-for="movie in movieStore.movies" :movie="movie">
      </MovieListerCard>
    </ul>
  </div>
</template>

<style scoped></style>
