<script setup>
import { onMounted, inject, ref } from 'vue';
import TwButton from '../components/base/TwButton.vue';
import TwInput from '../components/base/TwInput.vue';

const $socket = inject('$socket');

let isHost = ref(false);
const socketId = ref(false);
const insideRoom = ref(false);
const roomId = ref('');
const joinRequests = ref([]);
const members = ref([]);
const counters = ref({});

function createRoom() {
  $socket.emit('create room');
}

function increaseCounter() {
  $socket.emit('increase count', roomId.value);
}

function requestMembership() {
  $socket.emit('request membership', roomId.value);
}

function acceptJoinRequest(userId, room) {
  $socket.emit('accept membership', userId, room);
  joinRequests.value = joinRequests.value.filter((id) => id !== userId);
}

function rejectJoinRequest(userId, room) {
  $socket.emit('reject membership', userId, room);
}

onMounted(() => {
  $socket.on('connect', () => {
    socketId.value = $socket.id;
  });

  $socket.on('count increased', (userId) => {
    console.log(`attempting to increase count for ${userId}`);

    if (!members.value.includes(userId)) {
      return console.log('member does not exists');
    }

    if (counters.value[userId] !== undefined) {
      console.log('increasing counter for', userId);
      counters.value[userId] += 1;
    } else {
      console.log('creating counter for', userId);
      counters.value[userId] = 0;
    }
  });

  $socket.on('awaiting membership', () => {
    console.log('awaiting membership!');
    insideRoom.value = true;
  });

  $socket.on('member joined', (userId) => {
    console.log(`${userId} is now a member of the room!`);
    members.value.push(userId);
  });

  $socket.on('member left', (userId) => {
    console.log(`${userId} left the room!`);
    members.value = members.value.filter((id) => id !== userId);
  });

  $socket.on('room created', (_roomId) => {
    roomId.value = _roomId;
    isHost.value = true;
    members.value.push(socketId.value);
    insideRoom.value = true;
  });

  $socket.on('user joined', (userId) => {
    console.log(`User ${userId} has joined the room`);
    joinRequests.value.push(userId);
    // Update the UI to show that a new user has joined the room
  });

  $socket.on('user accepted', (userId) => {
    console.log(`You have been accepted into room ${room}`);
    joinRequests.value = joinRequests.value.filter((userId) => userId !== room);
    members.value.push(room);
    // Update the UI to show that the user has been accepted into the room
  });
});
</script>

<template>
  <section class="space-y-3">
    <div v-if="!insideRoom">
      <h1 class="text-primary-900 text-2xl font-bold uppercase">Socket Test</h1>
      <TwButton @click="createRoom">Create room</TwButton>
      <!-- Input to join a room specifying its id -->
      <TwInput v-model="roomId" placeholder="Enter room id" />
      <TwButton @click="requestMembership">Join room</TwButton>
    </div>
    <!-- Room component -->
    <div v-else>
      <h1 class="text-primary-900 text-2xl font-bold uppercase">Room {{ roomId }}</h1>
      <!-- Join requests (host only) -->
      <div v-if="isHost">
        <h3 class="font-bold">Join Requests</h3>
        <div v-for="(request, i) in joinRequests" :key="i">
          <span>{{ request }}</span>
          <TwButton @click="acceptJoinRequest(request, roomId)">Accept</TwButton>
          <TwButton @click="rejectJoinRequest(request, roomId)">Reject</TwButton>
        </div>
      </div>
      <!-- Members -->
      <ol>
        <h3 class="font-bold">Members</h3>
        <li v-for="(member, i) in members" :key="i">
          <span>{{ member }}</span>
          <span>:</span>
          <span v-if="counters[member]">{{ counters[member] }}</span>
          <span v-else>0</span>
        </li>
      </ol>
    </div>
    <!-- Member expression button -->
    <div class="space-y-4 rounded bg-neutral-500 p-2" v-if="members.includes(socketId)">
      <p>You '{{ socketId }}' are a member</p>
      <TwButton @click="increaseCounter">Increase counter</TwButton>
    </div>
  </section>
</template>

<style scoped></style>
