<script setup>
import BaseButton from './BaseButton.vue';
import { computed } from 'vue';
const emit = defineEmits(['update:modelValue']);
const props = defineProps({ modelValue: { type: Boolean, required: true } });

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
</script>

<template>
  <div
    class="pointer-events-none fixed left-0 top-0 z-50 h-full w-full bg-neutral-200 opacity-0 transition-opacity duration-700"
    :class="{ 'pointer-events-auto opacity-[95%]': visible }"
  >
    <slot></slot>
    <BaseButton @click="() => (visible = false)" class="absolute right-5 top-5">BACK</BaseButton>
  </div>
</template>
