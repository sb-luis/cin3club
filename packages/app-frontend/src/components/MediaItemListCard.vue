<script setup>
import { useMainStore } from '../stores/MainStore';
import { useListStore } from '../stores/ListStore';

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});
const mainStore = useMainStore();
const listStore = useListStore();
</script>

<template>
    <div v-if="item" @click="() => mainStore.navigate({ path: `list/${item.id}` })"
        class="flex w-full justify-between rounded-2xl bg-neutral-100 px-3 py-2 shadow-[0_30px_50px_-15px_rgba(0,0,0,0.5)] hover:bg-neutral-200 md:p-3">
        <h3 class="break-words text-xl md:text-3xl">{{ item.title }}</h3>
        <p class="break-words text-xl md:text-3xl">{{ item.mediaItems.length }}</p>
    </div>
</template>
