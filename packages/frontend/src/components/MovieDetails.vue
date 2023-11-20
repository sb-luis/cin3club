<script setup>
import { onMounted, watch } from 'vue';
import { useMainStore } from '../stores/MainStore';
import { useMovieStore } from '../stores/MovieStore';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import MovieDetailsCard from './MovieDetailsCard.vue';
import debounce from 'lodash.debounce';

const movieStore = useMovieStore();
const mainStore = useMainStore();
const route = useRoute();

const getMovieDetailsDebounced = debounce(async () => {
  movieStore.getMovieDetails(route.params.id);
}, 1000);

const { movieDetails } = storeToRefs(movieStore);

onMounted(() => {
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
  <MovieDetailsCard :movie="movieStore.selectedMovie" />
</template>

<style scoped></style>
