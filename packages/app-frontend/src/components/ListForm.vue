<script setup>
import { ref, onMounted } from 'vue';

import TwInput from './base/TwInput.vue';
import TwButton from './base/TwButton.vue';

import { useListStore } from '../stores/ListStore';
import Lists from '../pages/Lists.vue';

const props = defineProps({
  update: {
    type: Boolean,
    default: false,
  },
});

const listStore = useListStore();

const tempTitle = ref(null);
const tempDescription = ref(null);

onMounted(() => {
  if (props.update) {
    // updating list 
    tempTitle.value = listStore.selectedList.title;
    tempDescription.value = listStore.selectedList.description;
  } else {
    // creating new list 
    tempTitle.value = '';
    tempDescription.value = '';
  }
});

const handleSubmitList = async () => {
  if (props.update) {
    await listStore.updateList({ title: tempTitle.value, description: tempDescription.value });
  } else {
    await listStore.createList({ title: tempTitle.value, description: tempDescription.value });
  }
  await listStore.getAllLists();
};

const handleDeleteList = async () => {
  await listStore.deleteList();
  await listStore.getAllLists();
};

const i18nListFormKey = props.update ? 'update' : 'create';
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmitList">
      <h4 class="pb-5 text-4xl">{{ $t(`components.listForm.${i18nListFormKey}.title`) }}</h4>
      <!-- List Title -->
      <div class="mb-10">
        <label for="title" class="text-2xl"> {{ $t('components.listForm.titleLabel') }}</label>
        <TwInput v-model="tempTitle" class="mt-2 w-full" type="text" id="title" name="title" minlength="3"
          maxlength="20" />
      </div>
      <!-- List Description -->
      <div class="mb-10">
        <label for="description" class="text-2xl">{{ $t('components.listForm.descriptionLabel') }}</label>
        <TwInput v-model="tempDescription" class="mt-2 w-full" type="text" id="description" name="description"
          minlength="3" maxlength="100" />
      </div>

      <div class="flex flex-col items-end space-y-4">
        <TwButton type="submit">
          {{ $t(`components.listForm.${i18nListFormKey}.submitButton`) }}
        </TwButton>
        <TwButton type="button" @click="handleDeleteList" v-if="props.update">
          {{ $t(`components.listForm.${i18nListFormKey}.deleteButton`) }}
        </TwButton>
      </div>
    </form>
  </div>
</template>
