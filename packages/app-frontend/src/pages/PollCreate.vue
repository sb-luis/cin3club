<script setup>
import { onMounted, inject, ref } from 'vue';
import PollRoomCreate from '@/components/PollRoomCreate.vue';
import PollRoomStage from '@/components/PollRoomStage.vue';
import PollRoomRun from '@/components/PollRoomRun.vue';
import PollRoomResults from '@/components/PollRoomResults.vue';

const POLL_PHASES = Object.freeze({
  create: 'create',
  staging: 'staging',
  running: 'running',
  end: 'finished',
});

const $socket = inject('$socket');

const pollPhase = ref(POLL_PHASES.create);
const pollData = ref({});

function handlePollCreationDone(_poll) {
  console.log('Handling Poll Creation Done');
  console.log(_poll);
  pollData.value = _poll;
  pollPhase.value = POLL_PHASES.staging;
}

function handlePollStagingDone(_poll) {
  console.log('Handling Poll Staging Done');
  console.log(_poll);
  pollData.value = _poll;
  pollPhase.value = POLL_PHASES.running;
}

function handlePollRunningDone(_poll) {
  console.log('Handling Poll Running Done');
  console.log(_poll);
  pollData.value = _poll;
  pollPhase.value = POLL_PHASES.end;
}

onMounted(() => {
  console.log('PollCreate page mounted');
  console.log('Poll Data');
  console.log(pollData.value);
});
</script>

<template>
  <section class="space-y-3">
    <PollRoomCreate v-if="pollPhase === POLL_PHASES.create" @done="(poll) => handlePollCreationDone(poll)" />
    <PollRoomStage
      v-else-if="pollPhase === POLL_PHASES.staging"
      :initialPollData="pollData"
      @done="(poll) => handlePollStagingDone(poll)"
    />
    <PollRoomRun
      v-else-if="pollPhase === POLL_PHASES.running"
      :initialPollData="pollData"
      @done="(poll) => handlePollRunningDone(poll)"
    />
    <PollRoomResults v-else-if="pollPhase === POLL_PHASES.end" :pollData="pollData" />
  </section>
</template>

<style scoped></style>
