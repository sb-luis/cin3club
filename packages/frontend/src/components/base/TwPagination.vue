<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue';

const { modelValue, totalPages } = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits();

const currentPage = ref(modelValue);

const goToPage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage.value) {
    currentPage.value = pageNumber;
    emit('update:modelValue', currentPage.value);
  }
};

// Watch for changes in currentPage or totalPages and ensure currentPage is valid
watch([() => currentPage.value, () => totalPages], () => {
  if (currentPage.value < 1) {
    goToPage(1);
  } else if (currentPage.value > totalPages) {
    goToPage(totalPages);
  }
});
</script>

<template>
  <div class="select-none text-lg">
    <ul class="flex justify-between space-x-1 text-xl">
      <li
        @click="goToPage(1)"
        class="cursor-pointer p-3 hover:text-neutral-300"
        :class="{ '!cursor-not-allowed text-neutral-300 hover:text-neutral-300': currentPage === 1 }"
      >
        <span>First</span>
      </li>
      <li
        @click="goToPage(currentPage - 1)"
        class="cursor-pointer p-3 hover:text-neutral-300"
        :class="{ '!cursor-not-allowed text-neutral-300 hover:text-neutral-300': currentPage === 1 }"
      >
        <span>Back</span>
      </li>
      <p class="flex-1"></p>
      <li
        class="cursor-pointer p-3 hover:text-neutral-300"
        :class="{ '!cursor-not-allowed text-neutral-300 hover:text-neutral-300': currentPage === totalPages }"
        @click="goToPage(currentPage + 1)"
      >
        <span>Next</span>
      </li>
      <li
        @click="goToPage(totalPages)"
        class="cursor-pointer p-3 hover:text-neutral-300"
        :class="{ '!cursor-not-allowed text-neutral-300 hover:text-neutral-300': currentPage === totalPages }"
      >
        <span>Last</span>
      </li>
    </ul>
  </div>
</template>
