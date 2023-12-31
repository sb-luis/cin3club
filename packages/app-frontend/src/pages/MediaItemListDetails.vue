<script setup>
import { watch, onMounted, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import debounce from 'lodash.debounce';
import { LoopingRhombusesSpinner } from 'epic-spinners';
import { useTranslation } from "i18next-vue";
import { useHead } from '@unhead/vue'
import { useSortable, moveArrayElement } from '@vueuse/integrations/useSortable';

import { useMainStore } from '../stores/MainStore';
import { useListStore } from '../stores/ListStore';
import TwModal from '../components/base/TwModal.vue';
import MediaItemListForm from '../components/MediaItemListForm.vue';

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

const handleSubmitListForm = () => {
  modalIsOpen.value = false;
}

const getMediaItemListDetailsDebounced = debounce(async () => {
  console.log('getting all MediaItems in list')
  await listStore.getMediaItemListDetails(route.params.id);
}, 1000);

const { option } = useSortable(draggable, listStore.lists, {
  animation: 150,
  onUpdate: (e) => {
    // optimistic update on the FE 
    console.log(`Moving element at ${e.oldIndex} to ${e.newIndex}`)
    listStore.mediaItemListsOrderChanged = true;
    moveArrayElement(listStore.lists, e.oldIndex, e.newIndex);
    nextTick(() => {
      // kick off some async task
      // if the API call fail revert order ...
    });
  }
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
    <!-- LIST FORM MODAL -->
    <TwModal v-model="modalIsOpen">
      <MediaItemListForm v-if="modalIsOpen" @submit="handleSubmitListForm" update
        class="m-auto mt-20 max-w-[400px] rounded-2xl p-10" />
    </TwModal>
    <!-- LIST PAGE -->
    <div>
      <h1 class="text-primary-900 mb-5 text-2xl font-bold uppercase">{{ $t(`pages.mediaItemListDetails.title`) }}</h1>
    </div>
    <ul ref="draggable" class="flex flex-col gap-2 w-300px h-200px m-auto p-6 bg-neutral-300 rounded-2xl">
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