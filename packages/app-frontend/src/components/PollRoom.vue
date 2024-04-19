<script setup>
import TwButton from '../components/base/TwButton.vue';
import { onMounted, inject, ref } from 'vue';

const $socket = inject('$socket');

const members = ref([]);
const counters = ref({});

const { roomId, initialMembers } = defineProps({
  initialMembers: {
    type: Array,
    required: false,
    default: [],
  },
  roomId: {
    type: String,
    required: true,
  },
});

function increaseCounter() {
  console.log('increasing counter');
  $socket.emit('increase count', roomId);
}

onMounted(() => {
  members.value = initialMembers;

  console.log('PollRoom component mounted');

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
      counters.value[userId] = 1;
    }
  });

  $socket.on('member joined', (userId) => {
    console.log(`${userId} is now a member of the room!`);
    members.value.push(userId);
  });

  $socket.on('member left', (userId) => {
    console.log(`${userId} left the room!`);
    members.value = members.value.filter((id) => id !== userId);
  });
});
</script>

<template>
  <!-- Members -->
  <div class="space-y-4 border-2 border-black p-4">
    <div>
      <p class="text-primary-900 text-xl font-bold uppercase">Room {{ roomId }}</p>
      <p class="text-primary-900 text-xl font-bold uppercase">You are '{{ $socket.id }}'</p>
    </div>
    <ol>
      <h3 class="font-bold">Members clicks since you joined</h3>
      <li v-for="(member, i) in members" :key="i">
        <span>{{ member }}</span>
        <span>:</span>
        <span v-if="counters[member]">{{ counters[member] }}</span>
        <span v-else>0</span>
      </li>
    </ol>
    <!-- Member expression button -->
    <TwButton @click="increaseCounter">Increase counter</TwButton>
  </div>
</template>

<style scoped></style>
