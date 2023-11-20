<script setup>
import { onMounted, computed } from 'vue';
import { useMovieStore } from '../stores/MovieStore';
import RatingListerCard from './RatingListerCard.vue';

const movieStore = useMovieStore();

const groupedRatings = computed(() => {
  if (movieStore.ratings) {
    let lastDate = new Date(movieStore.ratings[0].dateSeen);
    let lastDateIndex = 0;

    const result = [{ dateSeen: lastDate, ratings: [movieStore.ratings[0]] }];
    for (let i = 1; i < movieStore.ratings.length; i++) {
      const rating = movieStore.ratings[i];
      const date = new Date(rating.dateSeen);
      if (date.toDateString() === lastDate.toDateString()) {
        result[lastDateIndex].ratings.push(rating);
      } else {
        lastDate = date;
        lastDateIndex++;
        result[lastDateIndex] = { dateSeen: date, ratings: [rating] };
      }
    }
    return result;
  } else {
    return [];
  }
});

onMounted(() => {
  movieStore.getAllRatings();
});
</script>

<template>
  <div>
    <h1 class="text-4xl pt-2 pb-5">{{ $t('pages.ratings.title') }}</h1>
    <div v-if="movieStore.ratings.length">
      <div class="m-auto py-4">
        <ul v-if="groupedRatings?.length && !movieStore.isLoading">
          <li v-for="group in groupedRatings">
            <p class="text-2xl p-2 px-4 shadow-2xl border-b-4 border-neutral-700">
              {{ group.dateSeen.toDateString() }}
            </p>
            <RatingListerCard class="my-5" v-for="rating in group.ratings" :rating="rating" />
          </li>
        </ul>
        <LoopingRhombusesSpinner
          v-else-if="movieStore.isLoading"
          class="mt-6 m-auto"
          :animation-duration="5000"
          :size="48"
        />
        <p v-else-if="!searchQueryError" class="text-center text-2xl">{{ $t('pages.movies.welcomeMessage') }}</p>
      </div>
    </div>
    <p v-else>You currently don't have any ratings</p>
  </div>
</template>
