<script setup>
import TwModal from '../components/base/TwModal.vue';
import { ref, watch, onMounted, computed } from 'vue';
import { useMovieStore } from '../stores/MovieStore';
import { LoopingRhombusesSpinner } from 'epic-spinners';
import RatingListerCard from './RatingListerCard.vue';
import RatingsForm from './RatingsForm.vue';
import TwPagination from './base/TwPagination.vue';
import debounce from 'lodash.debounce';

const movieStore = useMovieStore();

const ratingsModalIsOpen = ref(false);

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

const handleUpateRating = (rating) => {
  movieStore.selectedMovie = rating.movie;
  movieStore.selectedRating = rating;
  ratingsModalIsOpen.value = true;
};

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
      <!-- RATING LISTER MODAL -->
      <TwModal v-model="ratingsModalIsOpen">
        <RatingsForm v-if="ratingsModalIsOpen" update class="m-auto mt-20 max-w-[400px] rounded-2xl p-10" />
      </TwModal>

      <!-- SORT & PAGINATION CONTROLS -->
      <TwPagination
        v-if="movieStore.ratings.length"
        v-model="movieStore.ratingsPageCurrent"
        :total-pages="movieStore.ratingsPageTotal"
      />
      <div v-if="movieStore.ratings.length" class="flex justify-between px-3">
        <p class="mr-5 text-xl">
          {{ $t('pages.ratings.totalCount', { count: movieStore.ratingsItemsTotal }) }}
        </p>
        <p class="text-xl">
          <span class="pr-2">Page</span
          ><span>{{ movieStore.ratingsPageCurrent }} / {{ movieStore.ratingsPageTotal }}</span>
        </p>
        <button
          @click="movieStore.toggleRatingsSort"
          class="bg-primary-700 hover:bg-primary-800 flex w-[100px] justify-end rounded-xl pr-5 text-lg transition-all duration-500"
          :class="{ '!w-[90px]': movieStore.ratingsSortOrder === 'ASC' }"
        >
          <span
            class="rotate-90 px-2 text-2xl font-bold transition-transform duration-500"
            :class="{ 'rotate-[-450deg]': movieStore.ratingsSortOrder === 'ASC' }"
          >
            &gt;
          </span>
          <span class="pl-1 lowercase">{{ movieStore.ratingsSortOrder }}</span>
        </button>
      </div>
    </div>
    <LoopingRhombusesSpinner v-if="movieStore.isLoading" class="m-auto mt-20" :animation-duration="5000" :size="48" />
    <div v-else-if="movieStore.ratings.length">
      <div class="m-auto">
        <button></button>
        <ul v-if="groupedRatings?.length && !movieStore.isLoading">
          <li v-for="group in groupedRatings">
            <p class="border-b-4 border-neutral-300 p-2 px-4 text-2xl">
              {{ group.dateSeen.toDateString() }}
            </p>
            <RatingListerCard
              @click="() => handleUpateRating(rating)"
              class="my-5"
              v-for="rating in group.ratings"
              :rating="rating"
            />
          </li>
        </ul>
        <TwPagination
          v-if="movieStore.ratings.length > 3"
          v-model="movieStore.ratingsPageCurrent"
          :total-pages="movieStore.ratingsPageTotal"
        />
      </div>
    </div>
    <p v-else>You currently don't have any ratings</p>
  </div>
</template>
