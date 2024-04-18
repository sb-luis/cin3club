<script setup>
import { onMounted, inject } from 'vue';
import TwButton from '../components/base/TwButton.vue';

const $socket = inject('$socket');

function sendMessage() {
  console.log('sending message!');
  $socket.emit('chat message', 'hello world!');
}

onMounted(() => {
  $socket.on('chat message', (msg) => {
    console.log(msg);
  });
});
</script>

<template>
  <section class="space-y-3">
    <h1 class="text-primary-900 text-2xl font-bold uppercase">Socket Test</h1>
    <TwButton @click="sendMessage">Send message</TwButton>
  </section>
</template>

<style scoped></style>
