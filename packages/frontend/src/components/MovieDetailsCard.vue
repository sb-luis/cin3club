<script setup>
import { SelfBuildingSquareSpinner } from 'epic-spinners';
import { computed, watch } from 'vue';
import { useMovieStore } from '../stores/MovieStore';
import { useAuthStore } from '../stores/AuthStore';
import MovieDetailsRatings from './MovieDetailsRatings.vue';

const movieStore = useMovieStore();
const authStore = useAuthStore();

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

const movieYear = computed(() => {
  const d = new Date(props.movie.releaseDate);
  return d.getFullYear();
});

const directorsStr = computed(() => {
  return props.movie.directors?.join(',');
});

const moviePosterUrl = computed(() => {
  return `https://image.tmdb.org/t/p/w300_and_h450_face${props.movie.posterPath}`;
});

/*
    englishTitle +
    originalTitle +
    releaseDate +
    posterPath +
    description +
    runningTime +
    genres +
    productionCompanies [{
        name
        country // iso_3166_1
    }]
    languages: [
        iso_639_1
    ]
    status
    budget
    revenue
    imdbId
    tmdbId
*/

watch(
  props.movie,
  (newVal) => {
    console.log('value changed!');
    console.log(newVal);
  },
  { deep: true },
);
</script>

<template>
  <div
    v-if="!movieStore.isLoading && Object.keys(movie).length > 0"
    class="p-5 mt-10 bg-slate-900 md:p-6 rounded-2xl w-full shadow-[0_30px_50px_-15px_rgba(0,0,0,0.5)]"
  >
    <div class="flex justify-between pb-5">
      <div class="pr-4 max-w-[440px]">
        <!-- TITLE -->
        <div class="flex justify-between items-center space-x-5">
          <p class="text-2xl break-words md:text-3xl">{{ movie.englishTitle }}</p>
        </div>
        <p v-if="movie.originalTitle !== movie.englishTitle" class="text-sm text-blue-400 italic md:text-xl">
          {{ movie.originalTitle }}
        </p>
        <!-- YEAR and RUNNING TIME -->
        <div class="flex items-center space-x-4 text-lg py-5">
          <p>{{ movieYear }}</p>
          <p>|</p>
          <p>{{ movie.runningTime }}min</p>
        </div>
        <!-- DIRECTORS -->
        <div class="pb-4 md:flex md:space-x-2 text-lg">
          <h4>{{ $t('pages.movieDetails.directorListHeading') }}</h4>
          <p v-for="director in movie.directors" class="space-x-2">
            <span>{{ director }}</span>
          </p>
        </div>
        <!-- CAST -->
        <div class="pb-4 hidden md:block md:space-x-2 text-lg">
          <h4>{{ $t('pages.movieDetails.actorListHeading') }}</h4>
          <p v-for="actor in movie.cast" class="space-x-2">
            <span>{{ actor.name }}</span
            ><span class="text-slate-500 text-sm"
              >{{ $t('pages.movieDetails.actorListRole', { role: actor.character }) }}
            </span>
          </p>
        </div>
        <!-- PRODUCTION COUNTRIES -->
        <div class="pt-5 md:flex md:space-x-2 text-lg">
          <ul class="space-y-3">
            <li class="text-sm font-bold text-blue-500 uppercase" v-for="country in movie.productionCountries">
              {{ country }}
            </li>
          </ul>
        </div>
      </div>
      <!-- POSTER -->
      <div>
        <img v-show="moviePosterUrl" :src="moviePosterUrl" class="shadow-sm rounded-2xl w-[220px] md:w-[300px]" />
      </div>
    </div>
    <!-- GENRES -->
    <ul class="flex justify-end space-x-2 flex-wrap">
      <li
        class="text-sm mb-3 whitespace-nowrap bg-blue-900 uppercase p-2 md:px-4 rounded-xl"
        v-for="genre in movie.genres"
      >
        {{ genre }}
      </li>
    </ul>
    <!-- RATINGS -->
    <div class="pt-5 md:flex">
      <p class="text-lg pb-5 md:pr-20">{{ movie.description }}</p>
      <div v-if="authStore.credentials">
        <MovieDetailsRatings />
      </div>
    </div>
  </div>
  <SelfBuildingSquareSpinner v-else class="mt-20 m-auto" :animation-duration="2000" :size="48" />
</template>

<style scoped></style>
