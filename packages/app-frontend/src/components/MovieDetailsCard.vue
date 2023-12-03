<script setup>
import { SelfBuildingSquareSpinner } from 'epic-spinners';
import { computed, watch } from 'vue';
import { useMovieStore } from '../stores/MovieStore';
import { useAuthStore } from '../stores/AuthStore';
import MovieDetailsRatings from './MovieDetailsRatings.vue';

const movieStore = useMovieStore();
const authStore = useAuthStore();

const movie = computed(() => {
  return movieStore.selectedMovie ?? {};
});

const movieYear = computed(() => {
  const d = new Date(movie.value.releaseDate);
  return d.getFullYear();
});

const directorsStr = computed(() => {
  return movie.value.directors?.join(',');
});

const moviePosterUrl = computed(() => {
  return `https://image.tmdb.org/t/p/w300_and_h450_face${movie.value.posterPath}`;
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
</script>

<template>
  <div
    v-if="!movieStore.isLoading && movie && Object.keys(movie).length > 0"
    class="mt-4 w-full rounded-2xl bg-neutral-100 p-5 shadow-[0_30px_50px_-15px_rgba(0,0,0,0.5)] md:p-8"
  >
    <div class="flex pb-2 md:justify-between">
      <div class="max-w-[440px] md:pr-4">
        <!-- TITLE -->
        <div class="mb-5">
          <div class="flex items-center justify-between space-x-5">
            <h3 class="break-words text-3xl">{{ movie.englishTitle }}</h3>
          </div>
          <p v-if="movie.originalTitle !== movie.englishTitle" class="text-primary-900 text-sm italic md:text-xl">
            {{ movie.originalTitle }}
          </p>
        </div>

        <!-- POSTER MOBILE -->
        <div>
          <img
            v-show="moviePosterUrl"
            :src="moviePosterUrl"
            class="w-[200px] rounded-2xl object-contain shadow-sm md:hidden md:w-[300px]"
          />
        </div>

        <!-- YEAR and RUNNING TIME -->
        <div class="flex items-center space-x-4 py-5 text-lg">
          <p>{{ movieYear }}</p>
          <p>|</p>
          <p>{{ movie.runningTime }}min</p>
        </div>
        <!-- DIRECTORS -->
        <div class="pb-4 md:flex md:space-x-2 md:text-lg">
          <h4>{{ $t('pages.movieDetails.directorListHeading') }}</h4>
          <p v-for="director in movie.directors" class="space-x-2">
            <span>{{ director }}</span>
          </p>
        </div>
        <!-- CAST -->
        <div class="hidden pb-4 text-lg md:block md:space-x-2">
          <h4>{{ $t('pages.movieDetails.actorListHeading') }}</h4>
          <p v-for="actor in movie.cast" class="space-x-2">
            <span>{{ actor.name }}</span
            ><span class="text-sm text-neutral-500"
              >{{ $t('pages.movieDetails.actorListRole', { role: actor.character }) }}
            </span>
          </p>
        </div>
        <!-- PRODUCTION COUNTRIES -->
        <div class="flex text-lg md:space-x-2 md:pt-5">
          <ul class="flex space-x-3">
            <li class="text-primary-900 m-2 text-sm font-bold uppercase" v-for="country in movie.productionCountries">
              {{ country }}
            </li>
          </ul>
        </div>
      </div>
      <!-- POSTER TABLET/DESKTOP -->
      <div class="hidden md:block">
        <img v-show="moviePosterUrl" :src="moviePosterUrl" class="w-[220px] rounded-2xl shadow-sm md:w-[300px]" />
      </div>
    </div>
    <!-- GENRES -->
    <ul class="flex flex-wrap space-x-2 md:justify-end">
      <li
        class="bg-primary-200 mb-3 whitespace-nowrap rounded-xl p-2 text-sm uppercase md:px-4"
        v-for="genre in movie.genres"
      >
        {{ genre.name }}
      </li>
    </ul>
    <!-- RATINGS -->
    <div class="justify-end pt-5 md:flex">
      <p v-if="movie.description" class="pb-5 text-lg md:pr-20">{{ movie.description }}</p>
      <div v-if="authStore.credentials">
        <MovieDetailsRatings />
      </div>
    </div>
  </div>
  <SelfBuildingSquareSpinner v-else class="m-auto mt-20" :animation-duration="2000" :size="48" />
</template>

<style scoped></style>
