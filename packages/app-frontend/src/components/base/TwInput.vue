<script setup>
import { computed } from 'vue';
const emit = defineEmits(['update:modelValue']);
const props = defineProps(['modelValue']);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
</script>

<template>
  <input
    v-model="value"
    class="cursor-pointer rounded-xl bg-neutral-300 p-2 px-6 text-2xl text-neutral-700 autofill:bg-none hover:text-neutral-950 focus:text-neutral-950"
  />
</template>
