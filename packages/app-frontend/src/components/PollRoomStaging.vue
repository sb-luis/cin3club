<script setup>
import TwButton from '@/components/base/TwButton.vue';
import { onMounted, inject, ref } from 'vue';

const props = defineProps({
  roomId: {
    type: String,
    required: true,
  },
});

const joinRequests = ref([]);
const $socket = inject('$socket');

const urlCopied = ref(false);

function copyPollUrl() {
  const pollUrl = window.location.origin + window.location.pathname + `poll/${props.roomId}`;
  console.log(`copying poll url: ${pollUrl}`);
  urlCopied.value = true;
  navigator.clipboard.writeText(pollUrl);
}

function acceptJoinRequest(userId) {
  console.log('accepting join request', userId, props.roomId);
  $socket.emit('accept membership', userId, props.roomId);
  joinRequests.value = joinRequests.value.filter((id) => id !== userId);
}

function rejectJoinRequest(userId) {
  console.log('rejecting join request', userId, props.roomId);
  $socket.emit('reject membership', userId, props.roomId);
}

onMounted(() => {
  console.log('PollRoomStaging component mounted');

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
  <div>
    <!-- Share poll url -->
    <div>
      <TwButton @click="copyPollUrl">Share URL</TwButton>
      <p v-if="urlCopied">URL copied to clipboard!</p>
    </div>
    <!-- Join requests (host only) -->
    <div>
      <h3 class="font-bold">Join Requests</h3>
      <div
        class="flex items-center justify-between rounded bg-neutral-300 p-2"
        v-for="(request, i) in joinRequests"
        :key="i"
      >
        <span>{{ request }}</span>
        <span class="flex space-x-3">
          <TwButton size="sm" @click="acceptJoinRequest(request)">Accept</TwButton>
          <TwButton size="sm" @click="rejectJoinRequest(request)">Reject</TwButton>
        </span>
      </div>
    </div>
  </div>
</template>
