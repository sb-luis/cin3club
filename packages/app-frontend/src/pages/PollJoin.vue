<script setup>
import { onMounted, inject, ref } from 'vue';
import PollRoom from '../components/PollRoom.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const $socket = inject('$socket');

const roomExists = ref(false);
const roomId = ref(true);
const loading = ref(true);
const awaitingMembership = ref(false);
const membershipAccepted = ref(false);
const initialMembers = ref([]);

function requestMembership() {
  $socket.emit('request membership', roomId.value);
}

onMounted(() => {
  console.log('PollJoin page mounted');
  roomId.value = route.params.id;
  requestMembership(roomId.value);

  $socket.on('room does not exists', () => {
    console.log('room does not exists!');
    loading.value = false;
  });

  $socket.on('awaiting membership', () => {
    console.log('awaiting membership!');
    roomExists.value = true;
    loading.value = false;
    awaitingMembership.value = true;
  });

  $socket.on('membership approved', (members) => {
    console.log('membership approved!');
    initialMembers.value = members;
    awaitingMembership.value = false;
    membershipAccepted.value = true;
  });

  $socket.on('membership rejected', () => {
    console.log('membership rejected!');
    awaitingMembership.value = false;
  });
});
</script>

<template>
  <div>
    <p v-if="loading">Loading...</p>
    <p v-else-if="awaitingMembership">Awaiting to join room {{ roomId }}</p>
    <PollRoom v-else-if="membershipAccepted" :roomId="roomId" :initialMembers="initialMembers" />
    <p v-else-if="roomExists && !membershipAccepted">You have been rejected access to {{ roomId }}</p>
    <p v-else>Room '{{ roomId }}' does not exists</p>
  </div>
</template>

<style scoped></style>
