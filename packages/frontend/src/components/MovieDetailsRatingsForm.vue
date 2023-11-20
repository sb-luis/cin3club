<script setup>
import { ref, onMounted } from 'vue';
import { useMovieStore } from '../stores/MovieStore';
import { useMainStore } from '../stores/MainStore';

const mainStore = useMainStore();
const movieStore = useMovieStore();

const formatDate = (d) => {
  let day = ('0' + d.getDate()).slice(-2);
  const month = ('0' + (d.getMonth() + 1)).slice(-2);

  let year = d.getFullYear();
  return `${year}-${month}-${day}`;
};

// Compute today
const currentDate = new Date();
const today = formatDate(currentDate);

const tempDate = ref(null);
const tempScore = ref(null);

onMounted(() => {
  if (mainStore.currentContext === 'createRating') {
    tempDate.value = today;
    tempScore.value = 100;
  } else {
    const d = new Date(movieStore.selectedRating.dateSeen);
    tempDate.value = formatDate(d);
    tempScore.value = movieStore.selectedRating.score;
  }
});

const handleSubmitRating = () => {
  if (mainStore.currentContext === 'createRating') {
    movieStore.createRating({ dateSeen: tempDate.value, score: tempScore.value });
  } else {
    movieStore.updateRating({ dateSeen: tempDate.value, score: tempScore.value });
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmitRating">
    <h4 class="text-4xl pb-5">{{ $t(`components.ratingForm.${mainStore.currentContext}.title`) }}</h4>
    <!-- Date Seen -->
    <div class="mb-10">
      <label for="dateSeen" class="text-2xl"> {{ $t('components.ratingForm.dateSeenLabel') }}</label>
      <input
        v-model="tempDate"
        class="bg-gray-700 rounded-2xl mt-2 w-full p-2 text-2xl"
        type="date"
        id="dateSeen"
        name="dateSeen"
        min="1970-01-01"
        :max="today"
      />
    </div>
    <!-- Score -->
    <div class="mb-10">
      <label for="score" class="text-2xl">{{ $t('components.ratingForm.scoreLabel') }}</label>
      <input
        v-model="tempScore"
        class="bg-gray-700 w-full rounded-2xl p-2 mt-2 text-2xl"
        type="number"
        id="score"
        name="score"
        step="10"
        min="0"
        max="100"
      />
    </div>

    <div class="flex flex-col items-end">
      <button
        type="submit"
        class="text-2xl p-2 rounded-2xl block w-[220px] bg-slate-700 border border-slate-800 hover:bg-slate-800 hover:border-blue-500 hover:text-blue-500 transition-border duration-500"
      >
        {{ $t(`components.ratingForm.${mainStore.currentContext}.submitButton`) }}
      </button>
    </div>
  </form>
</template>
