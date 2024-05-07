<script setup>
import { onMounted } from 'vue';
import { pollData } from '@/data.js';
import PollRoomResults from '@/components/PollRoomResults.vue';

const myPollData = pollData;

onMounted(() => {
  console.log('Debug mounted');
  //console.log(myPollData);
});
</script>

<template>
  <PollRoomResults :pollData="myPollData" />
</template>
