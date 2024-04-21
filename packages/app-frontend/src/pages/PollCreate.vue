<script setup>
  import { onMounted, inject, ref } from 'vue'
  import TwButton from '@/components/base/TwButton.vue'
  import PollRoom from '@/components/PollRoom.vue'
  import PollRoomStaging from '@/components/PollRoomStaging.vue'

  const $socket = inject('$socket')

  const roomCreated = ref(false)
  const roomId = ref('')

  function createRoom() {
    $socket.emit('create room')
  }

  onMounted(() => {
    console.log('PollCreate page mounted')

    $socket.on('room created', _roomId => {
      roomId.value = _roomId
      roomCreated.value = true
    })
  })
</script>

<template>
  <section class="space-y-3">
    <div v-if="!roomCreated">
      <TwButton @click="createRoom">Create poll</TwButton>
    </div>
    <!-- Poll Room component -->
    <div v-else class="border-2 border-black p-2">
      <PollRoomStaging :roomId="roomId" />
    </div>
    <PollRoom v-if="roomCreated" :roomId="roomId" :initialMembers="[$socket.id]" />
  </section>
</template>

<style scoped></style>
