<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { SelfBuildingSquareSpinner } from 'epic-spinners';

import { useMediaStore } from '../stores/MediaStore';

const mediaStore = useMediaStore();
const route = useRoute();

const isTvShow = route.meta.mediaType === 'tv';

const mediaItem = computed(() => {
  return mediaStore.selectedMediaItem ?? {};
});

const productionCountries = computed(() => {
  const countries = mediaItem.value.productionCompanies.map((company) => company.country);
  const uniqueCountries = [...new Set(countries)];
  return uniqueCountries ?? [];
});

const tvShowDateSpan = computed(() => {
  const releaseYear = mediaItem.value.releaseYear;
  const lastAirDate = mediaItem.value.lastAirDate;

  return releaseYear === lastAirDate ? releaseYear : `${releaseYear}-${lastAirDate}`;
});

const movieYear = computed(() => {
  const d = new Date(mediaItem.value.releaseDate);
  return d.getFullYear();
});

const directorsStr = computed(() => {
  return mediaItem.value.directors?.join(',');
});

const moviePosterUrl = computed(() => {
  return `https://image.tmdb.org/t/p/w300_and_h450_face${mediaItem.value.posterPath}`;
});
</script>

<template>
  <div
    v-if="!mediaStore.isLoading && mediaItem && Object.keys(mediaItem).length > 0"
    class="mt-4 w-full rounded-2xl bg-neutral-100 p-5 shadow-[0_30px_50px_-15px_rgba(0,0,0,0.5)] md:p-8"
  >
    <div class="flex pb-2 md:justify-between">
      <div class="max-w-[440px] md:pr-4">
        <!-- TITLE -->
        <div class="mb-5">
          <div class="flex items-center justify-between space-x-5">
            <h3 class="break-words text-3xl">{{ mediaItem.title }}</h3>
          </div>
          <p
            v-if="mediaItem.originalTitle !== mediaItem.englishTitle"
            class="text-primary-900 text-sm italic md:text-xl"
          >
            {{ mediaItem.originalTitle }}
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

        <!-- YEAR and OTHER INFO -->
        <div v-if="isTvShow" class="flex items-center space-x-4 py-5 text-lg">
          <p>{{ tvShowDateSpan }}</p>
          <p>|</p>
          <p>{{ $t('pages.tvDetails.episodeCount', { count: mediaItem.episodes }) }}</p>
          <p>|</p>
          <p>{{ $t('pages.tvDetails.seasonCount', { count: mediaItem.seasons }) }}</p>
        </div>
        <div v-else class="flex items-center space-x-4 py-5 text-lg">
          <p>{{ mediaItem.releaseYear }}</p>
          <p>|</p>
          <p>{{ mediaItem.runningTime }}min</p>
        </div>
        <!-- DIRECTORS / CREATORS-->
        <div v-if="isTvShow" class="pb-4 md:flex md:space-x-2 md:text-lg">
          <h4>{{ $t('pages.tvDetails.createdByHeading') }}</h4>
          <p v-for="creator in mediaItem.createdBy" class="space-x-2">
            <span>{{ creator }}</span>
          </p>
        </div>
        <div v-else class="pb-4 md:flex md:space-x-2 md:text-lg">
          <h4>{{ $t('pages.movieDetails.directorListHeading') }}</h4>
          <p v-for="director in mediaItem.directors" class="space-x-2">
            <span>{{ director }}</span>
          </p>
        </div>
        <!-- CAST -->
        <div class="hidden pb-4 text-lg md:block md:space-x-2">
          <h4>{{ $t('pages.movieDetails.actorListHeading') }}</h4>
          <p v-for="actor in mediaItem.cast" class="space-x-2">
            <span>{{ actor.name }}</span
            ><span class="text-sm text-neutral-500"
              >{{ $t('pages.movieDetails.actorListRole', { role: actor.character }) }}
            </span>
          </p>
        </div>
        <!-- PRODUCTION COUNTRIES -->
        <div class="flex text-lg md:space-x-2 md:pt-5">
          <ul class="flex space-x-3">
            <li class="text-primary-900 m-2 text-sm font-bold uppercase" v-for="country in productionCountries">
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
        v-for="genre in mediaItem.genres"
      >
        {{ genre.name }}
      </li>
    </ul>
  </div>
  <SelfBuildingSquareSpinner v-else class="m-auto mt-20" :animation-duration="2000" :size="48" />
</template>

<style scoped></style>
