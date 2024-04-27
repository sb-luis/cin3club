<script setup>
import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from 'radix-vue';
import BaseButton from '@/components/base/BaseButton.vue';
import MediaItemHorListCard from '@/components/MediaItemHorListCard.vue';
import { onMounted, inject, ref } from 'vue';
import {
  ACCEPT_MEMBERSHIP,
  MEMBERSHIP_ACCEPTED,
  MEMBERSHIP_REJECTED,
  REJECT_MEMBERSHIP,
  USER_JOINED,
  USER_LEFT,
} from '@/socket-constants';

const props = defineProps({
  initialPollData: {
    type: Object,
    required: false,
    default: {},
  },
});
const emit = defineEmits(['done']);

const $socket = inject('$socket');
const $notify = inject('$notify');
const joinRequests = ref([]);
const pollData = ref({});

function copyPollUrl() {
  const pollUrl = window.location.origin + window.location.pathname + `poll/${props.initialPollData.roomId}`;
  console.log(`copying poll url: ${pollUrl}`);
  $notify({
    title: 'Poll URL copied',
    message: pollUrl,
    type: 'success',
  });
  navigator.clipboard.writeText(pollUrl);
}

function acceptJoinRequest(userId) {
  const roomId = pollData.value.roomId;
  console.log('accepting join request', userId, roomId);
  $socket.emit(ACCEPT_MEMBERSHIP, userId, roomId);
  joinRequests.value = joinRequests.value.filter((id) => id !== userId);
}

function rejectJoinRequest(userId) {
  const roomId = pollData.value.roomId;
  console.log('rejecting join request', userId, roomId);
  $socket.emit(REJECT_MEMBERSHIP, userId, roomId);
}

onMounted(() => {
  console.log('PollRoomStaging mounted');
  console.log('Initial poll data');
  console.log(props.initialPollData);
  pollData.value = props.initialPollData;

  console.log('All choices:');
  console.log(pollData.value.choices);

  $socket.on(USER_JOINED, (userId) => {
    console.log(`User ${userId} has joined the room`);
    $notify({
      title: userId,
      message: 'requested access to the poll!',
      type: 'success',
    });
    joinRequests.value.push(userId);
  });

  $socket.on(USER_LEFT, (userId) => {
    console.log(`User ${userId} has left the room`);
    $notify({
      title: userId,
      message: 'left the poll!',
      type: 'info',
    });
    // Check if user is a member or a join request
    if (pollData.value.members.includes(userId)) {
      pollData.value.members = pollData.value.members.filter((id) => id !== userId);
    } else {
      joinRequests.value = joinRequests.value.filter((id) => id !== userId);
    }
  });

  $socket.on(MEMBERSHIP_ACCEPTED, (members) => {
    $notify({
      title: 'new member',
      message: 'a new member was accepted in the poll!',
      type: 'success',
    });
    pollData.value.members = members;
  });

  $socket.on(MEMBERSHIP_REJECTED, (userId) => {
    console.log(`${userId} was rejected from the room!`);
    $notify({
      title: userId,
      message: 'was rejected from the poll!',
      type: 'info',
    });
    joinRequests.value = joinRequests.value.filter((id) => id !== userId);
  });
});
</script>

<template>
  <div v-if="pollData && pollData.members">
    <h1 class="mb-4 text-4xl md:text-5xl lg:text-6xl">
      {{
        pollData.members.length <= 1
          ? 'Invite at least 1 more member'
          : `Invite a max of ${5 - pollData.members.length} more members`
      }}
    </h1>
    <!-- Media Items -->
    <div v-if="pollData.choices" class="mb-3 flex max-w-4xl overflow-x-auto">
      <MediaItemHorListCard v-for="(item, i) in pollData.choices" :key="i" :item="item" />
    </div>
    <TabsRoot class="shadow-blackA4 flex w-full flex-col shadow-[0_2px_10px]" default-value="tab1">
      <TabsList class="relative flex shrink-0" aria-label="Manage your account">
        <TabsIndicator
          class="absolute bottom-0 left-0 h-[2px] w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position] rounded-full px-8 transition-[width,transform] duration-300"
        >
          <div class="h-full w-full" />
        </TabsIndicator>
        <TabsTrigger
          class="text-mauve11 hover:text-grass11 data-[state=active]:text-grass11 flex h-[45px] flex-1 cursor-default select-none items-center justify-center rounded-tl-md px-5 text-[15px] leading-none outline-none focus-visible:relative focus-visible:shadow-[0_0_0_2px] focus-visible:shadow-black"
          value="tab1"
        >
          <p>
            Join Requests
            <span class="rounded-2xl bg-neutral-800 px-2 text-neutral-200">{{ joinRequests.length }}</span>
          </p>
        </TabsTrigger>
        <TabsTrigger
          class="text-mauve11 hover:text-grass11 data-[state=active]:text-grass11 flex h-[45px] flex-1 cursor-default select-none items-center justify-center rounded-tr-md px-5 text-[15px] leading-none outline-none focus-visible:relative focus-visible:shadow-[0_0_0_2px] focus-visible:shadow-black"
          value="tab2"
        >
          <p>
            Members <span class="rounded-2xl bg-neutral-800 px-2 text-neutral-200">{{ pollData.members.length }}</span>
          </p>
        </TabsTrigger>
      </TabsList>
      <TabsContent class="grow rounded-b-md p-5 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black" value="tab1">
        <!-- Join requests (host only) -->
        <div v-if="joinRequests.length">
          <div
            class="flex items-center justify-between rounded bg-neutral-300 p-2"
            v-for="(userId, i) in joinRequests"
            :key="i"
          >
            <span>{{ userId }}</span>
            <span class="flex space-x-3">
              <BaseButton size="sm" @click="acceptJoinRequest(userId)">Accept</BaseButton>
              <BaseButton size="sm" @click="rejectJoinRequest(userId)">Reject</BaseButton>
            </span>
          </div>
        </div>
      </TabsContent>
      <TabsContent class="grow rounded-b-md p-5 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black" value="tab2">
        <p v-for="userId in pollData.members" :key="userId">{{ userId }}</p>
      </TabsContent>
    </TabsRoot>
    <!-- Share poll url -->
    <div class="mt-3 flex" v-if="pollData.members">
      <BaseButton v-if="pollData.members.length >= 2" @click="() => emit('done', pollData)">Start Poll</BaseButton>
      <BaseButton @click="copyPollUrl">Share URL</BaseButton>
    </div>
  </div>
</template>
