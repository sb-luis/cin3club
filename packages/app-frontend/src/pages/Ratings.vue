<script setup>
import { watch, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import debounce from 'lodash.debounce';
import { LoopingRhombusesSpinner } from 'epic-spinners';

import MediaItemListerCard from '../components/MediaItemListerCard.vue';
import TwButton from '../components/base/TwButton.vue';
import TwPagination from '../components/base/TwPagination.vue';

import { useMainStore } from '../stores/MainStore';
import { useRatingStore } from '../stores/RatingStore';

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
  ratingStore.populateRatingStoreFromQuery(route.query);
  ratingStore.isLoading = true;
  getRatingsDebounced();
});

watch([() => ratingStore.currentPage, () => ratingStore.sortOrder, () => ratingStore.sortType], async (newVal) => {
  ratingStore.isLoading = true;
  mainStore.navigate({
    path: route.path,
    query: {
      ...route.query,
      page: ratingStore.currentPage,
      sortOrder: ratingStore.sortOrder,
      sortType: ratingStore.sortType,
    },
    replace: true,
  });
  await getRatingsDebounced();
});
</script>

<template>
  <section>
    <div>
      <h1 class="text-primary-900 mb-5 text-2xl font-bold uppercase">{{ $t(`pages.ratings.title`) }}</h1>
      <div class="mb-2 flex items-center justify-between">
        <p class="text-lg">{{ $t('pages.ratings.totalCount', { count: ratingStore.ratingsTotal }) }}</p>
        <!-- SORT CONTROLS -->
        <div class="flex items-center space-x-2">
          <p>
            {{ $t('pages.ratings.sort.sortTypeLabel') }}
          </p>
          <TwButton
            size="sm"
            @click="ratingStore.sortType = 'dateSeen'"
            :highlight="ratingStore.sortType === 'dateSeen'"
          >
            {{ $t('pages.ratings.sort.sortByDateLabel') }}
          </TwButton>
          <TwButton size="sm" @click="ratingStore.sortType = 'score'" :highlight="ratingStore.sortType === 'score'">
            {{ $t('pages.ratings.sort.sortByScoreLabel') }}
          </TwButton>
          <TwButton
            @click="ratingStore.toggleRatingsSort"
            size="sm"
            class="flex justify-end rounded-xl text-lg transition-all duration-500"
          >
            <span
              class="rotate-90 text-sm transition-transform duration-500"
              :class="{ 'rotate-[-450deg]': ratingStore.sortOrder === 'asc' }"
            >
              &gt;
            </span>
          </TwButton>
        </div>
      </div>

      <!-- PAGINATION CONTROLS -->
      <TwPagination
        v-if="ratingStore.totalPages"
        v-model="ratingStore.currentPage"
        :total-pages="ratingStore.totalPages"
      >
        <template v-slot:first>{{ $t('pages.ratings.pagination.firstButton') }}</template>
        <template v-slot:back>{{ $t('pages.ratings.pagination.backButton') }}</template>
        <template v-slot:next>{{ $t('pages.ratings.pagination.nextButton') }}</template>
        <template v-slot:last>{{ $t('pages.ratings.pagination.lastButton') }}</template>

        <p class="text-center text-lg">
          <span class="pr-2">{{ $t('pages.ratings.pagination.pageLabel') }}</span
          ><span>{{ ratingStore.currentPage }} / {{ ratingStore.totalPages }}</span>
        </p>
      </TwPagination>
    </div>
    <LoopingRhombusesSpinner v-if="ratingStore.isLoading" class="m-auto mt-20" :animation-duration="5000" :size="48" />
    <div v-else-if="ratingStore.ratings.length">
      <div class="m-auto">
        <button></button>
        <ul v-if="groupedRatings?.length && !ratingStore.isLoading">
          <li v-for="group in groupedRatings">
            <p class="border-b-4 border-neutral-300 px-4 text-2xl">
              {{ group.dateSeen.toDateString() }}
            </p>
            <MediaItemListerCard
              class="my-5"
              v-for="rating in group.ratings"
              :item="rating.mediaItem"
              :rating="rating"
            />
          </li>
        </ul>
        <TwPagination
          class="py-5"
          v-if="ratingStore.totalPages && ratingStore.ratings.length > 3"
          v-model="ratingStore.currentPage"
          :total-pages="ratingStore.totalPages"
        >
          <template v-slot:first>{{ $t('pages.ratings.pagination.firstButton') }}</template>
          <template v-slot:back>{{ $t('pages.ratings.pagination.backButton') }}</template>
          <template v-slot:next>{{ $t('pages.ratings.pagination.nextButton') }}</template>
          <template v-slot:last>{{ $t('pages.ratings.pagination.lastButton') }}</template>

          <p class="text-center text-lg">
            <span class="pr-2">{{ $t('pages.ratings.pagination.pageLabel') }}</span
            ><span>{{ ratingStore.currentPage }} / {{ ratingStore.totalPages }}</span>
          </p>
        </TwPagination>
      </div>
    </div>
    <p v-else>{{ $t('pages.ratings.noRatingsText') }}</p>
  </section>
</template>
