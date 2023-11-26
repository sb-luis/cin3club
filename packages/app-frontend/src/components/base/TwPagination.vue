<script setup>
import { computed, onMounted, defineProps, defineEmits } from 'vue';

const props = defineProps({
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

const currentPage = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    let legalPage = value;
    if (value < 1) {
      legalPage = 1;
    } else if (value > props.totalPages) {
      legalPage = props.totalPages;
    }
    emit('update:modelValue', legalPage);
  },
});

const goToPage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= props.totalPages && pageNumber !== currentPage.value) {
    currentPage.value = pageNumber;
  }
};

onMounted(() => {
  // Reset current page to make initial page value legal
  currentPage.value = currentPage.value;
});
</script>

<template>
  <div class="select-none text-lg">
    <ul class="flex justify-between space-x-4 text-xl">
      <li
        @click="goToPage(1)"
        class="cursor-pointer hover:text-neutral-400"
        :class="{ '!cursor-not-allowed text-neutral-400 hover:text-neutral-400': currentPage === 1 }"
      >
        <slot name="first"></slot>
      </li>
      <li
        @click="goToPage(currentPage - 1)"
        class="cursor-pointer hover:text-neutral-400"
        :class="{ '!cursor-not-allowed text-neutral-400 hover:text-neutral-400': currentPage === 1 }"
      >
        <slot name="back"></slot>
      </li>
      <p class="flex-1"><slot></slot></p>
      <li
        class="cursor-pointer hover:text-neutral-400"
        :class="{ '!cursor-not-allowed text-neutral-400 hover:text-neutral-400': currentPage === totalPages }"
        @click="goToPage(currentPage + 1)"
      >
        <slot name="next"></slot>
      </li>
      <li
        @click="goToPage(totalPages)"
        class="cursor-pointer hover:text-neutral-400"
        :class="{ '!cursor-not-allowed text-neutral-400 hover:text-neutral-400': currentPage === totalPages }"
      >
        <slot name="last"></slot>
      </li>
    </ul>
  </div>
</template>
