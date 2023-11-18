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
    :class="{ 'opacity-50': !movieDetails, border: movieStore.selectedMovie === movie.id }"
  >
    <div class="text-start p-2">
      <div class="pb-5">
        <p class="text-2xl md:text-4xl py-2">{{ movie.title }}</p>
        <div class="md:text-lg flex items-center space-x-2 md:space-x-4">
          <p>{{ dateStrToYear(movie.releaseDate) }}</p>
          <!-- <span v-if="movieDetails">|</span>
          <p v-if="movieDetails">{{ movieDetails.runningTime }}</p> -->
          <!-- <span v-if="movieDetails" class="hidden md:block">|</span>
          <div v-if="movieDetails" class="hidden md:flex items-center">
            <p>{{ movieDetails.metascore }}</p>
            <span class="p-2 text-xs">metascore</span>
          </div> -->
        </div>
      </div>
      <!-- <div class="pb-2 md:flex" v-if="movieDetails">
        <p class="pr-2">Director:</p>
        <p class="font-bold">{{ movieDetails.Director }}</p>
      </div>
      <div class="pb-2 hidden md:flex" v-if="movieDetails">
        <p class="pr-2">Cast:</p>
        <p class="font-bold">{{ movieDetails.Actors }}</p>
      </div>
      <div class="md:flex" v-if="movieDetails">
        <p class="pr-2">Country:</p>
        <p class="font-bold">{{ movieDetails.Country }}</p>
      </div> -->
    </div>
    <div class="relative flex justify-center items-start w-[200px] h-[300px]">
      <RatingForm v-show="movieStore.selectedMovie === movie.id" />
      <div class="absolute z-[-1] top-0 left-0">
        <img
          :src="movie.posterPath"
          class="shadow-sm rounded-2xl w-[200px]"
          :class="{ 'blur-xl opacity-50': movieStore.selectedMovie === movie.id }"
        />
      </div>
    </div>
  </div>
</template>
