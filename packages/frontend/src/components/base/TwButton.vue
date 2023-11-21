<script setup>
defineProps({
  size: {
    type: String,
    /* supports xs, sm, base, lg and xl */
    default: 'base',
  },
});
</script>

<template>
  <button
    class="transition-border block border-2 border-neutral-200 bg-neutral-300 duration-300 hover:border-neutral-950 hover:bg-neutral-200 hover:text-neutral-950 focus:text-neutral-950"
    :class="{ 'rounded-2xl p-2 text-2xl': size === 'lg', 'rounded-xl p-2 px-4 text-xl': size === 'base' }"
  >
    <slot></slot>
  </button>
</template>
