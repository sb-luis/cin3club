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
  <div class="text-lg select-none">
    <ul class="flex justify-between">
      <li
        @click="goToPage(1)"
        class="py-1 cursor-pointer hover:text-blue-300"
        :class="{ '!cursor-not-allowed text-neutral-800 hover:text-neutral-800': currentPage === 1 }"
      >
        <span>First</span>
      </li>
      <li
        @click="goToPage(currentPage - 1)"
        class="py-1 cursor-pointer hover:text-blue-300"
        :class="{ '!cursor-not-allowed text-neutral-800 hover:text-neutral-800': currentPage === 1 }"
      >
        <span>Back</span>
      </li>
      <li class="py-1 bg-blue-500 rounded-xl px-5 w-[170px] text-center">
        <span class="pr-2">Page</span><span>{{ currentPage }} / {{ totalPages }}</span>
      </li>
      <li
        class="py-1 cursor-pointer hover:text-blue-300"
        :class="{ '!cursor-not-allowed text-neutral-800 hover:text-neutral-800': currentPage === totalPages }"
        @click="goToPage(currentPage + 1)"
      >
        <span>Next</span>
      </li>
      <li
        @click="goToPage(totalPages)"
        class="py-1 cursor-pointer hover:text-blue-300"
        :class="{ '!cursor-not-allowed text-neutral-800 hover:text-neutral-800': currentPage === totalPages }"
      >
        <span>Last</span>
      </li>
    </ul>
  </div>
</template>
