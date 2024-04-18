<script setup>
import { watch, onMounted, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import debounce from 'lodash.debounce';
import { LoopingRhombusesSpinner } from 'epic-spinners';
import { useTranslation } from 'i18next-vue';
import { useHead } from '@unhead/vue';
import { useSortable, moveArrayElement } from '@vueuse/integrations/useSortable';

import { useMainStore } from '../stores/MainStore';
import { useListStore } from '../stores/ListStore';
import TwModal from '../components/base/TwModal.vue';
import TwButton from '../components/base/TwButton.vue';
import MediaItemSearch from '../components/MediaItemSearch.vue';

const mainStore = useMainStore();
const listStore = useListStore();
const route = useRoute();
const { t } = useTranslation();

const modalIsOpen = ref(false);
const updateListFormIsOpen = ref(false);
const createListFormIsOpen = ref(false);
const draggable = ref(null);

const handleCreateList = () => {
  createListFormIsOpen.value = true;
  modalIsOpen.value = true;
};

const handleUpdateList = (list) => {
  listStore.selectedList = list;
  updateListFormIsOpen.value = true;
  modalIsOpen.value = true;
};

const computeHead = () => {
  useHead({
    title: `${t('app.title')} | ${t('pages.mediaItemListDetails.title')}`,
  });
};

computeHead();

const handleMediaItemSelected = (mediaItem) => {
  listStore.addMediaItemToList(route.params.id, mediaItem);
  modalIsOpen.value = false;
};

const getMediaItemListDetailsDebounced = debounce(async () => {
  console.log('getting all MediaItems in list');
  await listStore.getMediaItemListDetails(route.params.id);
}, 1000);

const { option } = useSortable(draggable, listStore.lists, {
  animation: 150,
  onUpdate: (e) => {
    // optimistic update on the FE
    console.log(`Moving element at ${e.oldIndex} to ${e.newIndex}`);
    listStore.mediaItemListsOrderChanged = true;
    moveArrayElement(listStore.lists, e.oldIndex, e.newIndex);
    nextTick(() => {
      // kick off some async task
      // if the API call fail revert order ...
    });
  },
});

onMounted(() => {
  listStore.populateListStoreFromQuery(route.query);
  listStore.isLoading = true;
  getMediaItemListDetailsDebounced();
});

watch([() => mainStore.lang], async (newVal) => {
  computeHead();
  console.log('Watcher triggered refetch of Member Lists');
  listStore.isLoading = true;
  mainStore.navigate({
    path: route.path,
    query: {
      ...route.query,
    },
    replace: true,
  });
  await getMediaItemListDetailsDebounced();
});
</script>

<template>
  <section>
    <!-- SEARCH MODAL -->
    <TwModal v-model="modalIsOpen">
      <MediaItemSearch class="h-[90%] p-5 py-10" @item-selected="handleMediaItemSelected" />
    </TwModal>
    <!-- LIST PAGE -->
    <div>
      <h1 class="text-primary-900 mb-5 text-2xl font-bold uppercase">{{ $t(`pages.mediaItemListDetails.title`) }}</h1>
      <TwButton @click="() => (modalIsOpen = true)">
        {{ $t(`pages.mediaItemListDetails.searchCatalogButton`) }}</TwButton
      >
    </div>
    <ul ref="draggable" class="w-300px h-200px m-auto flex flex-col gap-2 rounded-2xl bg-neutral-300 p-6">
      <LoopingRhombusesSpinner v-if="listStore.isLoading" class="m-auto my-5" :animation-duration="5000" :size="48" />
      <template v-else-if="listStore?.selectedList?.mediaItems?.length && !listStore.isLoading">
        <li v-for="mediaItem in listStore?.selectedList?.mediaItems" :key="mediaItem.id">
          <p>{{ mediaItem }}</p>
        </li>
      </template>
      <p v-else>{{ $t('pages.mediaItemListDetails.noMediaItemsText') }}</p>
    </ul>
  </section>
</template>

<style>
.sortable-chosen {
  opacity: 10%;
}
</style>
