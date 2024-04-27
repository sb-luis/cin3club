<script setup>
import BaseButton from '../components/base/BaseButton.vue';
import MediaItemHorListCard from '../components/MediaItemHorListCard.vue';
import { onMounted, inject, ref, computed } from 'vue';

const $notify = inject('$notify');

const props = defineProps({
  choices: {
    type: Array,
    required: true,
  },
  totalVotes: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['done']);
const roundStarted = ref(false);
const votesLeft = ref(0);
const votes = ref([]);

const filteredChoices = computed(() => {
  return props.choices.filter((choice) => {
    // Remove choices that have already been voted for
    return !votes.value.find((vote) => vote === choice.tmdbId);
  });
});

function endRound(_roundResults) {
  console.log('Ending round');
  roundStarted.value = false;
  emit('done', _roundResults);
}

function resetVotes() {
  console.log('Resetting currentRoundVotes');
  votes.value = [];
  votesLeft.value = props.totalVotes;
}

function vote(choice) {
  if (votesLeft.value <= 0) {
    $notify({
      title: 'No more votes',
      message: 'You have already voted for the maximum number of choices',
      type: 'error',
    });
    return;
  }
  console.log('Voting for choice', choice);
  $notify({
    title: 'Voted',
    message: choice.title,
    type: 'success',
  });
  votes.value.push(choice.tmdbId);
  votesLeft.value -= 1;
}

onMounted(() => {
  console.log('PollRoomRunRound mounted');

  // Start round
  votes.value = [];
  votesLeft.value = props.totalVotes;
  roundStarted.value = true;
});
</script>

<template>
  <div v-if="roundStarted">
    <h3 v-if="votesLeft > 0">You have {{ votesLeft }} of {{ props.totalVotes }} votes left</h3>
    <!-- List choices -->
    <p>{{ votesLeft === 0 ? 'Please, submit your votes' : 'Click on the choices you want to vote for' }}</p>
    <div v-if="votesLeft > 0">
    <h3 class="mt-5 text-2xl">Choices</h3>
    <ul class="my-3 flex space-x-2 overflow-x-auto">
      <li v-for="choice in filteredChoices" :key="choice.tmdbId">
        <MediaItemHorListCard :item="choice" @click="() => vote(choice)" />
      </li>
    </ul>
    </div>
    <!-- Submit votes -->
    <BaseButton v-if="votesLeft === 0" @click="emit('submit', votes)">Submit Votes</BaseButton>
  </div>
</template>

<style scoped></style>
