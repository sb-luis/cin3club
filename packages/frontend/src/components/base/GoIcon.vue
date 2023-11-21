<script setup>
// Using Google Font's Material Symbol library for Icons
// https://fonts.google.com/icons

defineProps({
  name: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <span class="material-symbols-outlined select-none"> {{ name }}</span>
</template>
