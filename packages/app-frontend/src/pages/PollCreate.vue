<script setup>
import { onMounted, inject, ref } from 'vue';
import TwButton from '../components/base/TwButton.vue';
import TwInput from '../components/base/TwInput.vue';
import PollRoom from '../components/PollRoom.vue';

const $socket = inject('$socket');

const urlCopied = ref(false);
const roomCreated = ref(false);
const roomId = ref('');
const joinRequests = ref([]);

function copyPollUrl() {
  const pollUrl = window.location.origin + window.location.pathname + `poll/${roomId.value}`;
  console.log(`copying poll url: ${pollUrl}`);
  urlCopied.value = true;
  navigator.clipboard.writeText(pollUrl);
}

function createRoom() {
  $socket.emit('create room');
}

function acceptJoinRequest(userId, room) {
  console.log('accepting join request', userId, room);
  $socket.emit('accept membership', userId, room);
  joinRequests.value = joinRequests.value.filter((id) => id !== userId);
}

function rejectJoinRequest(userId, room) {
  console.log('rejecting join request', userId, room);
  $socket.emit('reject membership', userId, room);
}

onMounted(() => {
  console.log('PollCreate page mounted');

  $socket.on('room created', (_roomId) => {
    roomId.value = _roomId;
    roomCreated.value = true;
  });

  $socket.on('user joined', (userId) => {
    console.log(`User ${userId} has joined the room`);
    joinRequests.value.push(userId);
  });

  $socket.on('user left', (userId) => {
    console.log(`User ${userId} has left the room`);
    joinRequests.value = joinRequests.value.filter((id) => id !== userId);
  });
});
</script>

<template>
  <section class="space-y-3">
    <div v-if="!roomCreated">
      <TwButton @click="createRoom">Create poll</TwButton>
    </div>
    <!-- Poll Room component -->
    <div v-else class="border-2 border-black p-2">
      <!-- Share poll url -->
      <TwButton @click="copyPollUrl">Share URL</TwButton>
      <p v-if="urlCopied">URL copied to clipboard!</p>
      <!-- Join requests (host only) -->
      <h3 class="font-bold">Join Requests</h3>
      <div
        class="flex items-center justify-between rounded bg-neutral-300 p-2"
        v-for="(request, i) in joinRequests"
        :key="i"
      >
        <span>{{ request }}</span>
        <span class="flex space-x-3">
          <TwButton size="sm" @click="acceptJoinRequest(request, roomId)">Accept</TwButton>
          <TwButton size="sm" @click="rejectJoinRequest(request, roomId)">Reject</TwButton>
        </span>
      </div>
    </div>
    <PollRoom v-if="roomCreated" :roomId="roomId" :initialMembers="[$socket.id]" />
  </section>
</template>

<style scoped></style>
