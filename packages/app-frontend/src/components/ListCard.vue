<script setup>
import { useMainStore } from '../stores/MainStore';
import { useListStore} from '../stores/ListStore';

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});
const mainStore = useMainStore();
const listStore= useListStore();
</script>

<template>
    <div v-if="item"
        class="flex w-full justify-between rounded-2xl bg-neutral-100 px-3 py-2 shadow-[0_30px_50px_-15px_rgba(0,0,0,0.5)] hover:bg-neutral-200 md:p-3">
        <div class="max-w-[50%] text-start md:max-w-[480px]">
            <h3 class="break-words text-xl md:text-3xl">{{ item.title }}</h3>
            <!-- <div class="flex items-center space-x-2 md:space-x-4 md:text-lg">
                                                <p>{{ item.description }}</p>
                                            </div> -->
        </div>
    </div>
</template>
