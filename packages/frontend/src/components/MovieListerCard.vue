<script setup>
import { computed } from 'vue';
import { useMainStore } from '../stores/MainStore';
import { useMovieStore } from '../stores/MovieStore';

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});
const mainStore = useMainStore();
const movieStore = useMovieStore();

const dateStrToYear = (str) => {
  const d = new Date(str);
  return d.getFullYear();
};

const fullPosterUrl = (path) => {
  return `https://image.tmdb.org/t/p/w220_and_h330_face${path}`;
};
</script>

<template>
  <div
    v-if="movie"
    @click="() => mainStore.navigate({ path: `movies/${movie.id}` })"
    class="bg-neutral-100 hover:bg-neutral-200 px-2 py-5 md:p-6 rounded-2xl w-full flex justify-between shadow-[0_30px_50px_-15px_rgba(0,0,0,0.5)]"
  >
    <div class="max-w-[480px] text-start">
      <p class="text-2xl break-words md:text-3xl py-2">{{ movie.englishTitle }}</p>
      <p v-if="movie.originalTitle !== movie.englishTitle" class="text-sm text-primary-900 italic md:text-xl py-2">
        {{ movie.originalTitle }}
      </p>
      <div class="md:text-lg flex items-center space-x-2 md:space-x-4">
        <p>{{ dateStrToYear(movie.releaseDate) }}</p>
      </div>
    </div>
    <img
      :src="fullPosterUrl(movie.posterPath)"
      class="shadow-sm rounded-2xl ml-2 w-[200px]"
      :class="{ 'blur-xl opacity-50': movieStore.selectedMovie === movie.id }"
    />
  </div>
</template>
