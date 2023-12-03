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
    class="flex w-full justify-between rounded-2xl bg-neutral-100 px-2 py-5 shadow-[0_30px_50px_-15px_rgba(0,0,0,0.5)] hover:bg-neutral-200 md:p-6"
  >
    <div class="max-w-[50%] text-start md:max-w-[480px]">
      <h3 class="break-words py-2 text-xl md:text-3xl">{{ movie.englishTitle }}</h3>
      <p v-if="movie.originalTitle !== movie.englishTitle" class="text-primary-900 py-2 text-sm italic md:text-xl">
        {{ movie.originalTitle }}
      </p>
      <div class="flex items-center space-x-2 md:space-x-4 md:text-lg">
        <p>{{ dateStrToYear(movie.releaseDate) }}</p>
      </div>
    </div>
    <div>
      <img
        :src="fullPosterUrl(movie.posterPath)"
        class="ml-2 w-[150px] rounded-2xl bg-red-200 object-contain shadow-sm md:w-[200px]"
        :class="{ 'opacity-50 blur-xl': movieStore.selectedMovie === movie.id }"
      />
    </div>
  </div>
</template>
