<script setup>
import { useMainStore } from '../stores/MainStore';
import { useMovieStore } from '../stores/MovieStore';

const props = defineProps({
  rating: {
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

const handleUpateRating = (rating) => {
  movieStore.selectedMovie = rating.movie;
  movieStore.selectedRating = rating;
  mainStore.setCurrentContext('updateRating');
};

const fullPosterUrl = (path) => {
  return `https://image.tmdb.org/t/p/w220_and_h330_face${path}`;
};
</script>

<template>
  <div
    v-if="rating.movie"
    @click="() => handleUpateRating(rating)"
    class="bg-slate-900 hover:bg-slate-800 p-5 md:p-6 rounded-2xl w-full flex justify-between shadow-[0_30px_50px_-15px_rgba(0,0,0,0.5)]"
  >
    <div class="max-w-[480px] text-start">
      <div class="pb-2">
        <p class="text-2xl break-words md:text-3xl">{{ rating.movie.englishTitle }}</p>
        <p
          v-if="rating.movie.originalTitle !== rating.movie.englishTitle"
          class="text-sm text-blue-400 italic md:text-xl pt-1"
        >
          {{ rating.movie.originalTitle }}
        </p>
      </div>
      <div class="md:text-lg flex items-center space-x-2 md:space-x-4">
        <p>{{ dateStrToYear(rating.movie.releaseDate) }}</p>
      </div>
      <div class="pt-10 flex">
        <p class="text-center text-4xl mb-3 whitespace-nowrap flex flex-col bg-blue-900 p-3 rounded-xl">
          <span class="text-sm font-bold mb-2 uppercase">your score</span>
          <span>
            {{ rating.score }}
          </span>
        </p>
      </div>
    </div>
    <img
      :src="fullPosterUrl(rating.movie.posterPath)"
      class="shadow-sm rounded-2xl ml-2 w-[200px]"
      :class="{ 'blur-xl opacity-50': movieStore.selectedMovie === rating.movie.id }"
    />
  </div>
</template>
