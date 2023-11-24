<script setup>
import { onMounted, watch } from 'vue';
import { useMainStore } from '../stores/MainStore';
import { useMovieStore } from '../stores/MovieStore';
import { useRoute } from 'vue-router';
import MovieDetailsCard from './MovieDetailsCard.vue';
import debounce from 'lodash.debounce';

const movieStore = useMovieStore();
const mainStore = useMainStore();
const route = useRoute();

const getMovieDetailsDebounced = debounce(async () => {
  movieStore.getMovieDetails(route.params.id);
}, 1000);

onMounted(() => {
  movieStore.selectedMovie = {};
  getMovieDetailsDebounced();
});

watch(
  () => mainStore.lang,
  () => {
    // re-fetch movie details if language changes
    movieStore.isLoading = true;
    getMovieDetailsDebounced();
  },
);
</script>

<template>
  <div>
    <h1 class="text-primary-900 text-2xl font-bold uppercase">{{ $t(`pages.movieDetails.title`) }}</h1>
    <MovieDetailsCard />
  </div>
</template>

<style scoped></style>
