<script setup>
import { onMounted, inject, ref } from 'vue';
import PollRoomRunRound from './PollRoomRunRound.vue';
import { ROUND_STARTED, ROUND_ENDED, SUBMIT_VOTES, START_POLL, POLL_STARTED, POLL_ENDED } from '@/socket-constants';

const $socket = inject('$socket');
const $notify = inject('$notify');

const pollData = ref({});
const pollStarted = ref(false);
const totalRounds = ref(0);
const votesSubmitted = ref(false);
const currentRound = ref(0);
const currentRoundChoices = ref(0);
const currentRoundVotes = ref(0);

const props = defineProps({
  initialPollData: {
    type: Object,
    required: false,
    default: {},
  },
});
const emit = defineEmits(['done']);

function submitVotes(_votes) {
  console.log('Sending current round votes', _votes);
  if (_votes.length < currentRoundVotes.value) {
    $notify({
      title: 'Not enough votes',
      message: 'Please use all your votes before submitting',
      type: 'error',
    });
    return;
  }

  $notify({
    title: 'Votes',
    message: 'submitted',
    type: 'success',
  });
  $socket.emit(SUBMIT_VOTES, _votes, pollData.value.roomId);
  votesSubmitted.value = true;
}

onMounted(() => {
  console.log('PollRoomRun component mounted');
  pollData.value = props.initialPollData;

  $socket.on(POLL_STARTED, (_poll) => {
    console.log('poll started event received');
    /*
  {
    roomId: room.id,
    members: room.members,
    choices: _pollChoices,
    roundIndex: 0,
    roundsTotal: 0,
    rounds: [],
    winner: {},
  };
  */
    pollData.value = _poll;
    totalRounds.value = _poll.roundsTotal;
    currentRound.value = _poll.roundIndex;
    pollStarted.value = true;

    console.log(`Poll started with ${_poll.roundsTotal} rounds`);

    $notify({
      title: 'Poll started',
      message: `With a max of ${_poll.roundsTotal} rounds`,
      type: 'info',
    });
  });

  $socket.on(POLL_ENDED, (_poll) => {
    console.log('Poll ended event received');
    /*
  {
    roomId: room.id,
    members: room.members,
    choices: _pollChoices,
    roundIndex: 0,
    roundsTotal: 0,
    rounds: [],
    winner: {},
  };
  */
    $notify({
      title: 'Poll ended',
      message: 'Thanks for participating',
      type: 'info',
    });

    emit('done', _poll);
  });

  $socket.on(ROUND_STARTED, (_round, _roundIndex) => {
    console.log('Starting round', _roundIndex);
    /*
  {
    choices: _choices,
    totalVotes: totalVotes,
    votes: {},
  };
  */
    console.log(_round);
    console.log(_roundIndex);

    votesSubmitted.value = false;
    currentRound.value = _roundIndex + 1;
    currentRoundChoices.value = _round.choices;
    currentRoundVotes.value = _round.totalVotes;
    $notify({
      title: `Round ${currentRound.value} started`,
      message: `You have ${_round.totalVotes} votes`,
      type: 'info',
    });
  });

  // emit start poll after 1 second
  setTimeout(() => {
    console.log('Emitting start poll');
    $socket.emit(START_POLL, props.initialPollData.choices, props.initialPollData.roomId);
  }, 1000);
});
</script>

<template>
  <div v-if="pollStarted">
    <h1 class="mb-4 text-4xl md:text-5xl lg:text-6xl">Poll running</h1>
    <h2 class="text-2xl">Round {{ currentRound }} of {{ totalRounds }}</h2>
    <PollRoomRunRound
      v-if="currentRound > 0 && !votesSubmitted"
      :choices="currentRoundChoices"
      :totalVotes="currentRoundVotes"
      @submit="submitVotes"
    />
    <p v-else-if="currentRound > 0 && votesSubmitted">Waiting for everyone to submit their votes...</p>
    <p v-else>Starting poll...</p>
  </div>
  <div v-else>
    <h1 class="mb-4 text-4xl md:text-5xl lg:text-6xl">Awaiting poll start</h1>
  </div>
</template>

<style scoped></style>
