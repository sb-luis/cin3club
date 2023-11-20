<script setup>
import { computed } from 'vue';
import { useMainStore } from '../stores/MainStore';
import { useMovieStore } from '../stores/MovieStore';

const mainStore = useMainStore();
const movieStore = useMovieStore();

const sortedRatings = computed(() => {
  return (
    movieStore.selectedMovieRatings.sort(function (a, b) {
      if (a < b) return -1;
      else if (a > b) return 1;
      return 0;
    }) ?? []
  );
});

const handleUpateRating = (rating) => {
  movieStore.selectedRating = rating;
  mainStore.setCurrentContext('updateRating');
};

const formattedDate = (dateStr) => {
  const date = new Date(dateStr);

  return `${date.getFullYear()} ${date.toLocaleString(mainStore.lang, { month: 'short' })} ${date.getDate()}`;
};
</script>

<template>
  <div class="bg-slate-800 rounded-2xl text-xl md:text-base p-3 md:max-w-[250px]">
    <h3 v-if="sortedRatings.length" class="pb-5 font-bold uppercase">Your Ratings</h3>
    <h3 v-else class="font-bold text-center flex flex-col space-y-2 mb-2">
      <span> Have you seen this movie? </span>
    </h3>
    <ul v-if="sortedRatings.length" class="mb-5">
      <li v-for="(rating, i) in sortedRatings">
        <button
          @click="() => handleUpateRating(rating)"
          class="w-full md:w-[200px] bg-slate-900 p-2 text-xl md:text-base rounded flex justify-between mb-2 opacity-60 hover:opacity-100 hover:bg-slate-950 transition-colors duration-1000"
          :class="{ '!opacity-100': i === 0 }"
        >
          <span class="text-blue-300 italic text-sm md:text-xs">
            {{ formattedDate(rating.dateSeen) }}
          </span>
          <span class="font-bold bg-blue-700 px-2 rounded" :class="{ 'bg-white text-blue-700': i === 0 }">
            {{ rating.score }}</span
          >
        </button>
      </li>
    </ul>
    <button
      @click="mainStore.setCurrentContext('createRating')"
      class="bg-slate-700 border border-slate-800 hover:bg-slate-800 hover:border-blue-500 hover:text-blue-500 p-2 rounded-2xl block m-auto w-[220px] transition-all duration-500"
    >
      {{ sortedRatings.length ? 'New' : 'Rate it!' }}
    </button>
  </div>
</template>
