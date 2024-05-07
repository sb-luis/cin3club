<script setup>
import { ref, computed, onMounted } from 'vue';
import MediaItemCard from '../components/MediaItemCard.vue';

const props = defineProps({
  pollData: {
    type: Object,
    required: false,
    default: {},
  },
});

const fullPosterUrl = (path) => {
  return `https://image.tmdb.org/t/p/w220_and_h330_face${path}`;
};

const getChoiceVotes = (choice, voteObj) => {
  const id = choice.tmdbId;
  const voteCount = getVoteCount(voteObj);
  return voteCount[id] ? voteCount[id] : 0;
};

const rounds = computed(() => {
  if (!props.pollData.rounds) return [];
  const result = [];

  for (let i = 0; i < props.pollData.rounds.length; i++) {
    console.log('computing round', i);
    const round = props.pollData.rounds[i];
    const voteCount = getVoteCount(round.votes);
    const choices = round.choices.map((choice) => {
      return {
        ...choice,
        votes: voteCount[choice.tmdbId] ? voteCount[choice.tmdbId] : 0,
      };
    });
    // sort choices by vote count
    choices.sort((a, b) => b.votes - a.votes);

    result.push({ totalVotes: round.totalVotes, choices });
  }

  return result;
});

const getVoteCount = (voteObj) => {
  let allVotes = Object.values(voteObj);
  console.log('All votes');
  console.log(allVotes);
  console.log('All votes flat');
  allVotes = allVotes.flat();
  console.log(allVotes);
  const voteCount = allVotes.reduce((acc, vote) => {
    acc[vote] = acc[vote] ? acc[vote] + 1 : 1;
    return acc;
  }, {});

  console.log('Vote count');
  console.log(voteCount);

  return voteCount;
};

onMounted(() => {
  console.log('PollRoomResults mounted');
});
</script>

<template>
  <div>
    <h1 class="mb-4 text-4xl md:text-5xl lg:text-6xl">Poll ended</h1>
    <h2 class="mb-3 text-2xl">Winner is</h2>
    <MediaItemCard :item="pollData.winner" size="lg" />
    <div class="mt-10 p-2" v-for="(round, index) in rounds" :key="index">
      <h3 class="mb-2 text-xl">Round {{ index + 1 }}</h3>
      <p>Each user had {{ round.totalVotes }} votes</p>
      <div
        class="mt-2 flex items-center justify-between rounded bg-neutral-100 p-1"
        v-for="(choice, index) in round.choices"
        :class="{
          'opacity-20': choice.votes === 0,
        }"
        :key="index"
      >
        <img
          :src="fullPosterUrl(choice.posterPath)"
          class="w-[30px] rounded bg-red-200 object-contain shadow-sm md:w-[50px]"
        />
        <h3 class="break-words text-sm md:text-base">
          {{ choice.title }}
        </h3>
        <p>{{ choice.votes }}</p>
      </div>
    </div>
  </div>
</template>
