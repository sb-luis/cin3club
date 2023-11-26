<script setup>
import { watch, onMounted, computed } from 'vue';
import { useRatingStore } from '../stores/RatingStore';
import { LoopingRhombusesSpinner } from 'epic-spinners';
import RatingListerCard from './RatingListerCard.vue';
import TwPagination from './base/TwPagination.vue';
import debounce from 'lodash.debounce';
import { useRoute } from 'vue-router';
import { useMainStore } from '../stores/MainStore';

const mainStore = useMainStore();
const ratingStore = useRatingStore();
const route = useRoute();

const getRatingsDebounced = debounce(async () => {
  await ratingStore.getAllRatings();
}, 1000);

const groupedRatings = computed(() => {
  if (ratingStore.ratings) {
    let lastDate = new Date(ratingStore.ratings[0].dateSeen);
    let lastDateIndex = 0;

    const result = [{ dateSeen: lastDate, ratings: [ratingStore.ratings[0]] }];
    for (let i = 1; i < ratingStore.ratings.length; i++) {
      const rating = ratingStore.ratings[i];
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
  ratingStore.currentPage = parseInt(route.query.page) ?? 1;
  ratingStore.sortOrder = route.query.sort ?? 'DESC';

  ratingStore.isLoading = true;
  getRatingsDebounced();
});

watch(
  () => ratingStore.currentPage,
  async (newVal) => {
    ratingStore.isLoading = true;
    mainStore.navigate({
      path: route.path,
      query: { ...route.query, page: ratingStore.currentPage, sort: ratingStore.sortOrder },
      replace: true,
    });
    await getRatingsDebounced();
  },
);

watch(
  () => ratingStore.sortOrder,
  async (newVal) => {
    ratingStore.isLoading = true;
    mainStore.navigate({
      path: route.path,
      query: { ...route.query, page: ratingStore.currentPage, sort: ratingStore.sortOrder },
      replace: true,
    });
    await getRatingsDebounced();
  },
);
</script>

<template>
  <div>
    <h1 class="text-primary-900 mb-5 text-2xl font-bold uppercase">{{ $t(`pages.ratings.title`) }}</h1>

    <TwPagination
      class="mb-2"
      v-if="ratingStore.totalPages"
      v-model="ratingStore.currentPage"
      :total-pages="ratingStore.totalPages"
    >
      <template v-slot:first>{{ $t('pages.ratings.pagination.firstButton') }}</template>
      <template v-slot:back>{{ $t('pages.ratings.pagination.backButton') }}</template>
      <template v-slot:next>{{ $t('pages.ratings.pagination.nextButton') }}</template>
      <template v-slot:last>{{ $t('pages.ratings.pagination.lastButton') }}</template>
    </TwPagination>
    <div>
      <!-- SORT & PAGINATION CONTROLS -->
      <div v-if="ratingStore.ratings.length" class="flex justify-between">
        <p class="mr-5 text-xl">
          {{ $t('pages.ratings.totalCount', { count: ratingStore.ratingsTotal }) }}
        </p>
        <p class="text-xl">
          <span class="pr-2">{{ $t('pages.ratings.pagination.pageLabel') }}</span
          ><span>{{ ratingStore.currentPage }} / {{ ratingStore.totalPages }}</span>
        </p>
        <button
          @click="ratingStore.toggleRatingsSort"
          class="bg-primary-700 hover:bg-primary-800 flex w-[100px] justify-end rounded-xl pr-5 text-lg transition-all duration-500"
          :class="{ '!w-[90px]': ratingStore.sortOrder === 'ASC' }"
        >
          <span
            class="rotate-90 px-2 text-2xl font-bold transition-transform duration-500"
            :class="{ 'rotate-[-450deg]': ratingStore.sortOrder === 'ASC' }"
          >
            &gt;
          </span>
          <span class="pl-1 lowercase">{{ ratingStore.sortOrder }}</span>
        </button>
      </div>
    </div>
    <LoopingRhombusesSpinner v-if="ratingStore.isLoading" class="m-auto mt-20" :animation-duration="5000" :size="48" />
    <div v-else-if="ratingStore.ratings.length">
      <div class="m-auto">
        <button></button>
        <ul v-if="groupedRatings?.length && !ratingStore.isLoading">
          <li v-for="group in groupedRatings">
            <p class="border-b-4 border-neutral-300 p-2 px-4 text-2xl">
              {{ group.dateSeen.toDateString() }}
            </p>
            <RatingListerCard class="my-5" v-for="rating in group.ratings" :rating="rating" />
          </li>
        </ul>
        <TwPagination
          v-if="ratingStore.ratings.length > 3"
          v-model="ratingStore.currentPage"
          :total-pages="ratingStore.totalPages"
        />
      </div>
    </div>
    <p v-else>{{ $t('pages.ratings.noRatingsText') }}</p>
  </div>
</template>
