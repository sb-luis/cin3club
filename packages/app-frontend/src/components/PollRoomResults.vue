<script setup>
import { ref, onMounted } from 'vue';
import MediaItemListerCard from '../components/MediaItemListerCard.vue';

const props = defineProps({
  pollData: {
    type: Object,
    required: false,
    default: {},
  },
});

onMounted(() => {
  console.log('PollRoomResults mounted');
});
</script>

<template>
  <div>
    <h1 class="mb-4 text-4xl md:text-5xl lg:text-6xl">Poll ended</h1>
    <h2 class="text-2xl mb-3">Winner is</h2>
    <MediaItemListerCard :item="pollData.winner" />
  </div>
</template>
