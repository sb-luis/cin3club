<script setup>
import TwInput from './base/TwInput.vue';
import TwButton from './base/TwButton.vue';
import { ref, onMounted } from 'vue';
import { useMovieStore } from '../stores/MovieStore';
import { useMainStore } from '../stores/MainStore';

const props = defineProps({
  update: {
    type: Boolean,
    default: false,
  },
});

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
  if (props.update) {
    // updating rating
    const d = new Date(movieStore.selectedRating.dateSeen);
    tempDate.value = formatDate(d);
    tempScore.value = movieStore.selectedRating.score;
  } else {
    // creating new rating
    const d = new Date(movieStore.selectedRating.dateSeen);
    tempDate.value = today;
    tempScore.value = 50;
  }
});

const handleSubmitRating = () => {
  if (props.update) {
    movieStore.updateRating({ dateSeen: tempDate.value, score: tempScore.value });
  } else {
    movieStore.createRating({ dateSeen: tempDate.value, score: tempScore.value });
  }
};

const i18nRatingFormKey = props.update ? 'update' : 'create';
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmitRating">
      <h4 class="pb-5 text-4xl">{{ $t(`components.ratingForm.${i18nRatingFormKey}.title`) }}</h4>
      <!-- Date Seen -->
      <div class="mb-10">
        <label for="dateSeen" class="text-2xl"> {{ $t('components.ratingForm.dateSeenLabel') }}</label>
        <TwInput
          v-model="tempDate"
          class="mt-2 w-full"
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
        <TwInput v-model="tempScore" class="mt-2 w-full" type="number" id="score" name="score" min="0" max="100" />
      </div>

      <div class="flex flex-col items-end space-y-4">
        <TwButton type="submit">
          {{ $t(`components.ratingForm.${i18nRatingFormKey}.submitButton`) }}
        </TwButton>
        <TwButton type="button" @click="movieStore.deleteRating" v-if="props.update">
          {{ $t(`components.ratingForm.${i18nRatingFormKey}.deleteButton`) }}
        </TwButton>
      </div>
    </form>
  </div>
</template>
