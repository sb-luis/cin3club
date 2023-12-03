<script setup>
import { useMainStore } from '../stores/MainStore';

const mainStore = useMainStore();

const props = defineProps({
  rating: {
    type: Object,
    required: true,
  },
});

const dateStrToYear = (str) => {
  const d = new Date(str);
  return d.getFullYear();
};

const fullPosterUrl = (path) => {
  return `https://image.tmdb.org/t/p/w220_and_h330_face${path}`;
};
</script>

<template>
  <div
    @click="() => mainStore.navigate({ path: `movies/${rating.movie.id}` })"
    v-if="rating.movie"
    class="flex w-full justify-between rounded-2xl bg-neutral-100 p-5 shadow-[0_30px_50px_-15px_rgba(0,0,0,0.5)] hover:bg-neutral-200 md:p-6"
  >
    <div class="max-w-[50%] text-start md:max-w-[480px]">
      <div class="pb-2">
        <p class="break-words text-2xl md:text-3xl">{{ rating.movie.englishTitle }}</p>
        <p
          v-if="rating.movie.originalTitle !== rating.movie.englishTitle"
          class="text-primary-900 pt-1 text-sm italic md:text-xl"
        >
          {{ rating.movie.originalTitle }}
        </p>
      </div>
      <div class="flex items-center space-x-2 md:space-x-4 md:text-lg">
        <p>{{ dateStrToYear(rating.movie.releaseDate) }}</p>
      </div>
      <div class="flex pt-10">
        <p class="bg-primary-700 mb-3 flex flex-col whitespace-nowrap rounded-xl p-3 text-center text-4xl">
          <span class="mb-2 text-sm font-bold uppercase">your score</span>
          <span>
            {{ rating.score }}
          </span>
        </p>
      </div>
    </div>
    <div>
      <img
        :src="fullPosterUrl(rating.movie.posterPath)"
        class="ml-2 w-[150px] rounded-2xl object-contain shadow-sm md:w-[200px]"
      />
    </div>
  </div>
</template>
