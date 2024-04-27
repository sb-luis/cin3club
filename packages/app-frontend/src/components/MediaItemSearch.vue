<script setup>
import { ref, watch, computed } from 'vue';
import debounce from 'lodash.debounce';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['item-selected']);

const props = defineProps({
  excludeMediaItems: {
    type: Array,
    required: false,
    default: [],
  },
});

const filteredItems = computed(() => {
  return mediaStore.searchItems.filter((item) => {
    const itemsMatch = props.excludeMediaItems.some((excludedItem) => excludedItem.tmdbId === item.tmdbId);
    return !itemsMatch; 
  });
});

import TwInput from '../components/base/TwInput.vue';
import MediaItemListerCard from '../components/MediaItemListerCard.vue';

import { useMediaStore } from '../stores/MediaStore';

const mediaStore = useMediaStore();
const { searchQuery } = storeToRefs(mediaStore);

const getMediaItemsDebounced = debounce(async () => {
  await mediaStore.getMediaItems();
}, 1000);

const debounceValidation = debounce(async () => {
  mediaStore.validateQuery();
}, 300);

watch(searchQuery, () => {
  debounceValidation();
  getMediaItemsDebounced();
});

const selectedItem = ref(null);

const selectItem = (item) => {
  selectedItem.value = item;
  emit('item-selected', item);
};
</script>

<template>
  <section>
    <div>
      <label for="movie_query" class="hidden">{{ $t('pages.mediaItemSearch.searchLabel') }}</label>
      <TwInput
        v-model="searchQuery"
        class="w-full"
        type="text"
        id="first_name"
        :placeholder="$t('pages.mediaItemSearch.searchPlaceholder')"
      />
    </div>
    <ul v-if="filteredItems.length">
      <MediaItemListerCard class="my-5" v-for="item in filteredItems" :item="item" @click="selectItem(item)" />
    </ul>
  </section>
</template>

<style scoped></style>
