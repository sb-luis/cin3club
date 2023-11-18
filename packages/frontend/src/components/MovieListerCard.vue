<script setup>
import { computed } from 'vue';
import { useMovieStore } from '../stores/MovieStore';
import RatingForm from './RatingForm.vue';

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

const dateStrToYear = (str) => {
  const d = new Date(str);
  return d.getFullYear();
};

const fullPosterUrl = (path) => {
  return `https://image.tmdb.org/t/p/w220_and_h330_face${path}`;
};

const movieStore = useMovieStore();

const movieDetails = computed(() => {
  const details = movieStore.movieDetailsCache[props.movie.id];
  return details ? details : null;
});
</script>

<template>
  <div
    v-if="movie"
    @click="() => movieStore.selectMovie(movie.id)"
    class="bg-slate-900 hover:bg-slate-800 transition-colors duration-300 ease-cubic rounded-2xl w-full flex justify-between p-2 shadow-[0_30px_50px_-15px_rgba(0,0,0,0.5)]"
  >
    <div class="max-w-[480px] text-start p-2">
      <div class="pb-5">
        <p class="text-2xl break-words md:text-4xl py-2">{{ movie.englishTitle }}</p>
        <p v-if="movie.originalTitle !== movie.englishTitle" class="text-sm text-blue-400 italic md:text-2xl py-2">
          {{ movie.originalTitle }}
        </p>
        <div class="md:text-lg flex items-center space-x-2 md:space-x-4">
          <p>{{ dateStrToYear(movie.releaseDate) }}</p>
        </div>
      </div>
    </div>
    <div class="min-w-[220px] relative flex justify-center items-start w-[220px] h-[330px]">
      <RatingForm v-show="movieStore.selectedMovie === movie.id" />
      <div class="absolute top-0 left-0">
        <img
          :src="fullPosterUrl(movie.posterPath)"
          class="shadow-sm rounded-2xl w-[200px]"
          :class="{ 'blur-xl opacity-50': movieStore.selectedMovie === movie.id }"
        />
      </div>
    </div>
  </div>
</template>
