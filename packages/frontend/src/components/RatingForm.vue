<script setup>
import { ref } from 'vue';

const currentDate = new Date();
let day = currentDate.getDate();
let month = currentDate.getMonth() + 1;
let year = currentDate.getFullYear();
const today = `${year}-${month}-${day}`;

const dateSeen = ref(today);
const rating = ref(100);

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <form @click="() => movieStore.rateMovie({ id: movie.imdbID, dateSeen, rating })" class="px-4 p-2 rounded-lg">
    <h4 class="text-2xl pb-4">{{ $t('components.ratingForm.title') }}</h4>
    <!-- Score -->
    <div>
      <label for="rating" class="text-lg">{{ $t('components.ratingForm.ratingLabel') }}</label>
      <input
        v-model="rating"
        class="bg-gray-700 w-full rounded-lg px-2 mt-2 text-2xl"
        type="number"
        id="rating"
        name="rating"
        step="10"
        min="0"
        max="100"
      />
    </div>
    <!-- Date Seen -->
    <div class="mt-2">
      <label for="dateSeen" class="text-lg"> {{ $t('components.ratingForm.dateSeenLabel') }}</label>
      <input
        v-model="dateSeen"
        class="bg-gray-700 rounded-lg mt-2 w-full px-2 text-2xl"
        type="date"
        id="dateSeen"
        name="dateSeen"
        min="1970-01-01"
        :max="today"
      />
    </div>

    <button class="mt-3 p-1 rounded bg-green-800" type="submit">
      {{ $t(`components.ratingForm.submitButton`) }}
    </button>
  </form>
</template>
