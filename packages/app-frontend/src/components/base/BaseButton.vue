<script setup>
defineProps({
  size: {
    type: String,
    /* supports xs, sm, base, lg and xl */
    default: 'base',
  },
  highlight: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <button
    class="transition-border block border-2 border-neutral-200 bg-neutral-300 duration-300 hover:border-neutral-950 hover:bg-neutral-200 hover:text-neutral-950 active:bg-neutral-900"
    :class="{
      'rounded-2xl p-2 text-2xl': size === 'lg',
      'rounded-xl p-2 px-4 text-xl': size === 'base',
      'rounded-lg px-2 text-sm': size === 'sm',
      'text-primary-900 font-bold': highlight,
    }"
  >
    <slot></slot>
  </button>
</template>
