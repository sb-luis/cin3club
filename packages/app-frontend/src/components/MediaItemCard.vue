<script setup>
import { computed, onMounted } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  size: {
    type: String,
    default: 'md',
  },
});

const dateStrToYear = (str) => {
  const d = new Date(str);
  return d.getFullYear();
};

const fullPosterUrl = (path) => {
  return `https://image.tmdb.org/t/p/w220_and_h330_face${path}`;
};

onMounted(() => {
  console.log('MediaItemCard mounted');
  console.log(props.item);
});
</script>

<template>
  <div
    v-if="item"
    class="flex w-full justify-between bg-neutral-100 shadow-[0_30px_50px_-15px_rgba(0,0,0,0.5)] hover:bg-neutral-200"
    :class="{
      'px-2 py-1 md:p-2 rounded': size === 'sm',
      'p-2 rounded-xl': size === 'md',
      'px-2 py-3 md:p-5 rounded-xl': size === 'lg',
    }"
  >
    <div
      class="text-start"
      :class="{
        'flex items-center md:block': size === 'sm',
      }"
    >
      <h3
        class="break-words"
        :class="{
          'text-sm md:text-base': size === 'sm',
          '': size === 'md',
          'text-xl md:text-3xl': size === 'lg',
        }"
      >
        {{ item.title }}
      </h3>
      <p
        v-if="item.originalTitle !== item.title && size !== 'sm'"
        class="text-primary-900 italic"
        :class="{
          'text-sm  md:text-base': size === 'md',
          'py-1 md:py-2 md:text-xl': size === 'lg',
        }"
      >
        {{ item.originalTitle }}
      </p>
      <div
        class="flex items-center"
        :class="{
          'text-xs invisible md:visible': size === 'sm',
          '': size === 'md',
          'space-x-2 md:space-x-4 md:text-lg': size === 'lg',
        }"
      >
        <p>{{ item.releaseYear }}</p>
      </div>
    </div>
    <div>
      <img
        :src="fullPosterUrl(item.posterPath)"
        class="bg-red-200 object-contain shadow-sm"
        :class="{
          'w-[30px] md:w-[50px] rounded': size === 'sm',
          'w-[100px] rounded-2xl': size === 'md',
          'ml-2 w-[150px] md:w-[200px] rounded-2xl': size === 'lg',
        }"
      />
    </div>
  </div>
</template>
