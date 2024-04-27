<script setup>
import { onMounted, inject, ref } from 'vue';
import PollRoomRun from '@/components/PollRoomRun.vue';
import PollRoomResults from '@/components/PollRoomResults.vue';
import { useRoute } from 'vue-router';
import { AWAITING_MEMBERSHIP, MEMBERSHIP_ACCEPTED, MEMBERSHIP_REJECTED, ROOM_NOT_FOUND } from '@/socket-constants';

const route = useRoute();

const POLL_PHASES = Object.freeze({
  running: 'running',
  end: 'finished',
});

const $socket = inject('$socket');

const pollPhase = ref('');
const pollData = ref({});

const roomExists = ref(false);
const roomId = ref(true);
const loading = ref(true);
const awaitingMembership = ref(false);
const membershipAccepted = ref(false);
const initialMembers = ref([]);

function requestMembership() {
  $socket.emit('request membership', roomId.value);
}

function handlePollRunningDone(_poll) {
  console.log('Handling Poll Running Done');
  console.log(_poll);
  pollData.value = _poll;
  pollPhase.value = POLL_PHASES.end;
}

onMounted(() => {
  console.log('PollJoin page mounted');
  roomId.value = route.params.id;
  requestMembership(roomId.value);

  $socket.on(ROOM_NOT_FOUND, () => {
    console.log('room does not exists!');
    loading.value = false;
  });

  $socket.on(AWAITING_MEMBERSHIP, () => {
    console.log('awaiting membership!');
    roomExists.value = true;
    loading.value = false;
    awaitingMembership.value = true;
  });

  $socket.on(MEMBERSHIP_ACCEPTED, (members) => {
    console.log('membership approved!');
    initialMembers.value = members;
    awaitingMembership.value = false;
    membershipAccepted.value = true;
    pollPhase.value = POLL_PHASES.running;
  });

  $socket.on(MEMBERSHIP_REJECTED, () => {
    console.log('membership rejected!');
    awaitingMembership.value = false;
  });
});
</script>

<template>
  <div>
    <p v-if="loading">Loading...</p>
    <p v-else-if="awaitingMembership">Awaiting to join room {{ roomId }}</p>
    <div v-else-if="membershipAccepted" :roomId="roomId" :initialMembers="initialMembers">
      <PollRoomRun
        v-if="pollPhase === POLL_PHASES.running"
        :initialPollData="pollData"
        @done="(poll) => handlePollRunningDone(poll)"
      />
      <PollRoomResults v-else-if="pollPhase === POLL_PHASES.end" :pollData="pollData" />
    </div>
    <p v-else-if="roomExists && !membershipAccepted">You have been rejected access to {{ roomId }}</p>
    <p v-else>Room '{{ roomId }}' does not exists</p>
  </div>
</template>

<style scoped></style>
