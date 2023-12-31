<script setup>
import { computed } from 'vue';
import { useMainStore } from '../stores/MainStore';
import { useMediaStore } from '../stores/MediaStore';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  rating: {
    type: Object,
    default: null,
  },
});
const mainStore = useMainStore();
const mediaStore = useMediaStore();

const dateStrToYear = (str) => {
  const d = new Date(str);
  return d.getFullYear();
};

const fullPosterUrl = (path) => {
  return `https://image.tmdb.org/t/p/w220_and_h330_face${path}`;
};
</script>

<template>
  <div v-if="item"
    class="flex w-full justify-between rounded-2xl bg-neutral-100 px-2 py-5 shadow-[0_30px_50px_-15px_rgba(0,0,0,0.5)] hover:bg-neutral-200 md:p-6">
    <div class="max-w-[50%] text-start md:max-w-[480px]">
      <h3 class="break-words py-2 text-xl md:text-3xl">{{ item.title }}</h3>
      <p v-if="item.originalTitle !== item.title" class="text-primary-900 py-2 text-sm italic md:text-xl">
        {{ item.originalTitle }}
      </p>
      <div class="flex items-center space-x-2 md:space-x-4 md:text-lg">
        <p>{{ item.releaseYear }}</p>
      </div>
      <div v-if="rating" class="flex pt-10">
        <p class="bg-primary-700 mb-3 flex flex-col whitespace-nowrap rounded-xl p-3 text-center text-4xl">
          <span class="mb-2 text-sm font-bold uppercase">your score</span>
          <span>
            {{ rating.score }}
          </span>
        </p>
      </div>
    </div>
    <div>
      <img :src="fullPosterUrl(item.posterPath)"
        class="ml-2 w-[150px] rounded-2xl bg-red-200 object-contain shadow-sm md:w-[200px]"
        :class="{ 'opacity-50 blur-xl': mediaStore.selectedMediaItem === item.id }" />
    </div>
  </div>
</template>
