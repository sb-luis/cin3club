<script setup>
import { watch, onMounted, computed } from 'vue';
import { useMovieStore } from '../stores/MovieStore';
import { LoopingRhombusesSpinner } from 'epic-spinners';
import RatingListerCard from './RatingListerCard.vue';
import Pagination from './base/Pagination.vue';
import debounce from 'lodash.debounce';

const movieStore = useMovieStore();

const getRatingsDebounced = debounce(async () => {
  await movieStore.getAllRatings();
}, 1000);

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
  movieStore.isLoading = true;
  getRatingsDebounced();
});

watch(
  () => movieStore.ratingsPageCurrent,
  (newVal) => {
    movieStore.isLoading = true;
    getRatingsDebounced();
  },
);

watch(
  () => movieStore.ratingsSortOrder,
  (newVal) => {
    movieStore.isLoading = true;
    getRatingsDebounced();
  },
);
</script>

<template>
  <div>
    <div>
      <!-- SORT & PAGINATION CONTROLS -->
      <div v-if="movieStore.ratings.length" class="flex justify-between mb-2">
        <p class="text-xl mr-5">
          {{ $t('pages.ratings.totalCount', { count: movieStore.ratingsItemsTotal }) }}
        </p>
        <button
          @click="movieStore.toggleRatingsSort"
          class="flex justify-end pr-4 text-xl bg-blue-500 rounded-xl w-[100px] transition-all duration-300"
          :class="{ '!w-[90px]': movieStore.ratingsSortOrder === 'ASC' }"
        >
          <p
            class="rotate-90 text-2xl font-bold transition-transform duration-500 px-2"
            :class="{ 'rotate-[-90deg]': movieStore.ratingsSortOrder === 'ASC' }"
          >
            &gt;
          </p>
          <p>{{ movieStore.ratingsSortOrder }}</p>
        </button>
      </div>
      <Pagination
        v-if="movieStore.ratings.length"
        v-model="movieStore.ratingsPageCurrent"
        :total-pages="movieStore.ratingsPageTotal"
      />
    </div>
    <LoopingRhombusesSpinner v-if="movieStore.isLoading" class="mt-20 m-auto" :animation-duration="5000" :size="48" />
    <div v-else-if="movieStore.ratings.length">
      <div class="m-auto">
        <button></button>
        <ul v-if="groupedRatings?.length && !movieStore.isLoading">
          <li v-for="group in groupedRatings">
            <p class="text-2xl p-2 px-4 shadow-2xl border-b-4 border-neutral-700">
              {{ group.dateSeen.toDateString() }}
            </p>
            <RatingListerCard class="my-5" v-for="rating in group.ratings" :rating="rating" />
          </li>
        </ul>
        <Pagination
          v-if="movieStore.ratings.length > 3"
          v-model="movieStore.ratingsPageCurrent"
          :total-pages="movieStore.ratingsPageTotal"
        />
      </div>
    </div>
    <p v-else>You currently don't have any ratings</p>
  </div>
</template>
