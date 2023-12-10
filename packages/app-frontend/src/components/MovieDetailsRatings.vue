<script setup>
import { ref, computed, watch } from 'vue';
import { useMainStore } from '../stores/MainStore';
import { useMovieStore } from '../stores/MovieStore';
import { useRatingStore } from '../stores/RatingStore';
import TwModal from './base/TwModal.vue';
import RatingsForm from './RatingsForm.vue';
import { useRoute } from 'vue-router';

const mainStore = useMainStore();
const movieStore = useMovieStore();
const ratingStore = useRatingStore();
const route = useRoute();

const mediaItem = computed(() => movieStore.selectedMediaItem);

const modalIsOpen = ref(false);
const updateRatingFormIsOpen = ref(false);
const createRatingFormIsOpen = ref(false);

const sortedRatings = computed(() => {
  return (
    movieStore.selectedMediaItemRatings.sort(function (a, b) {
      if (a < b) return -1;
      else if (a > b) return 1;
      return 0;
    }) ?? []
  );
});

const handleCreateRating = () => {
  createRatingFormIsOpen.value = true;
  modalIsOpen.value = true;
};

const handleUpdateRating = (rating) => {
  ratingStore.selectedRating = rating;
  updateRatingFormIsOpen.value = true;
  modalIsOpen.value = true;
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()} ${date.toLocaleString(mainStore.lang, { month: 'short' })} ${date.getDate()}`;
};

watch(modalIsOpen, (newVal) => {
  if (!newVal) {
    // Closing rating modal
    ratingStore.selectedRating = {};
    updateRatingFormIsOpen.value = false;
    createRatingFormIsOpen.value = false;
  }
});
</script>

<template>
  <div class="rounded-2xl bg-neutral-200 p-3 text-xl md:max-w-[250px] md:text-neutral-500">
    {{ movieStore.selectedMediaItemRatings }}
    <!-- RATINGS MODAL -->
    <TwModal v-model="modalIsOpen">
      <RatingsForm
        :media-item="mediaItem"
        v-if="mediaItem && updateRatingFormIsOpen"
        update
        class="m-auto mt-20 max-w-[400px] rounded-2xl p-10"
      />
      <RatingsForm
        v-else-if="mediaItem && createRatingFormIsOpen"
        :media-item="mediaItem"
        class="m-auto mt-20 max-w-[400px] rounded-2xl p-10"
      />
    </TwModal>

    <!-- RATINGS -->
    <h3 v-if="sortedRatings.length" class="pb-5 font-bold uppercase">{{ $t('pages.movieDetails.ratingsTitle') }}</h3>
    <h3 v-else class="mb-2 flex flex-col space-y-2 text-center font-bold">
      <span> {{ $t(`pages.${route.meta.mediaType}Details.emptyRatingsLabel`) }} </span>
    </h3>
    <ul v-if="sortedRatings.length" class="mb-5">
      <li v-for="(rating, i) in sortedRatings">
        <button
          @click="() => handleUpdateRating(rating)"
          class="mb-2 flex w-full justify-between rounded bg-neutral-100 p-2 text-xl opacity-60 hover:bg-neutral-50 hover:opacity-100 md:w-[200px] md:text-neutral-500"
          :class="{ '!opacity-100': i === 0 }"
        >
          <span class="text-primary-900 text-sm italic md:text-xs">
            {{ formatDate(rating.dateSeen) }}
          </span>
          <span class="bg-primary-200 rounded px-2 font-bold" :class="{ '!bg-primary-600': i === 0 }">
            {{ rating.score }}</span
          >
        </button>
      </li>
    </ul>
    <button
      @click="handleCreateRating"
      class="hover:border-primary-900 hover:text-primary-900 m-auto block w-[220px] rounded-2xl border border-neutral-200 bg-neutral-300 p-2 transition-all duration-500 hover:bg-neutral-200"
    >
      {{ $t(`pages.${route.meta.mediaType}Details.newRatingButton`, { count: sortedRatings.length }) }}
    </button>
  </div>
</template>
