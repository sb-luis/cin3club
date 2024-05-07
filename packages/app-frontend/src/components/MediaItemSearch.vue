<script setup>
import { ref, watch, computed } from 'vue';
import debounce from 'lodash.debounce';
import { storeToRefs } from 'pinia';
import TwInput from '../components/base/TwInput.vue';
import MediaItemCard from '../components/MediaItemCard.vue';
import { useMediaStore } from '../stores/MediaStore';

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
    <ul class="py-2" v-if="filteredItems.length">
      <MediaItemCard class="my-2" v-for="item in filteredItems" :item="item" @click="selectItem(item)" size="md" />
    </ul>
  </section>
</template>

<style scoped></style>
