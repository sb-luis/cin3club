<script setup>
import { watch, onMounted, ref, computed, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import debounce from 'lodash.debounce';
import { LoopingRhombusesSpinner } from 'epic-spinners';
import { useTranslation } from "i18next-vue";
import { useHead } from '@unhead/vue'
import { useSortable, moveArrayElement } from '@vueuse/integrations/useSortable';

import { useMainStore } from '../stores/MainStore';
import { useListStore } from '../stores/ListStore';
import TwModal from '../components/base/TwModal.vue';
import TwButton from '../components/base/TwButton.vue';
import ListForm from '../components/ListForm.vue';
import ListCard from '../components/ListCard.vue';

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

const tempLists = computed({
  get() {
    return listStore.lists;
  },
  set(newValue) {
    listStore.lists = newValue;
  }
})

const handleUpdateList = (list) => {
  listStore.selectedList = list;
  updateListFormIsOpen.value = true;
  modalIsOpen.value = true;
};

const computeHead = () => {
  useHead({
    title: `${t('app.title')} | ${t('pages.lists.title')}`,
  });

};

computeHead();

const handleSubmitListForm = () => {
  modalIsOpen.value = false;
  createListFormIsOpen.value = false;
  updateListFormIsOpen.value = false;
}

const getListsDebounced = debounce(async () => {
  await listStore.getAllLists();
}, 1000);

const { option } = useSortable(draggable, tempLists, {
  animation: 150,
  onUpdate: (e) => {
    // optimistic update on the FE 
    console.log(`Moving element at ${e.oldIndex} to ${e.newIndex}`)
    moveArrayElement(tempLists.value, e.oldIndex, e.newIndex);
    nextTick(() => {
      // kick off some async task
      // if the API call fail revert order ...
    });
  }
});

onMounted(() => {
  listStore.populateListStoreFromQuery(route.query);
  listStore.isLoading = true;
  getListsDebounced();
});

watch([() => mainStore.lang, () => listStore.currentPage, () => listStore.sortOrder, () => listStore.sortType], async (newVal) => {
  computeHead();
  console.log('Watcher triggered refetch of Member Lists');
  listStore.isLoading = true;
  mainStore.navigate({
    path: route.path,
    query: {
      ...route.query,
      page: listStore.currentPage,
      sortOrder: listStore.sortOrder,
      sortType: listStore.sortType,
    },
    replace: true,
  });
  await getListsDebounced();
});
</script>

<template>
  <section>
    <!-- LIST FORM MODAL -->
    <TwModal v-model="modalIsOpen">
      <ListForm v-if="updateListFormIsOpen" @submit="handleSubmitListForm" update class="m-auto mt-20 max-w-[400px] rounded-2xl p-10" />
      <ListForm v-else-if="createListFormIsOpen" @submit="handleSubmitListForm" class="m-auto mt-20 max-w-[400px] rounded-2xl p-10" />
    </TwModal>
    <!-- LIST PAGE -->
    <div>
      <h1 class="text-primary-900 mb-5 text-2xl font-bold uppercase">{{ $t(`pages.lists.title`) }}</h1>
      <div class="mb-2 flex items-center justify-between">
        <p class="text-lg">{{ $t('pages.lists.totalCount', { count: listStore.lists.length }) }}</p>
      </div>
    </div>
    <LoopingRhombusesSpinner v-if="listStore.isLoading" class="m-auto mt-20" :animation-duration="5000" :size="48" />
    <ul ref="draggable" class="flex flex-col gap-2 w-300px h-200px m-auto p-6 bg-neutral-300 rounded-2xl">
      <template v-if="tempLists.length && !listStore.isLoading">
        <li v-for="list in tempLists" :key="list.id">
          <ListCard @click="() => handleUpdateList(list)" :item="list" />
        </li>
      </template>
      <p v-else>{{ $t('pages.lists.noListsText') }}</p>
    </ul>
    <TwButton @click="handleCreateList" class="mt-2">

      {{ $t(`pages.lists.createButton`) }}
    </TwButton>
  </section>
</template>

<style>
.sortable-chosen {
  opacity: 10%;
}
</style>