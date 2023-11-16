<script setup>
defineProps({
  movie: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="bg-slate-800 rounded flex justify-between p-2">
    <div>
      <p>
        {{ movie.Title }}
      </p>
      <p>
        {{ movie.Year }}
      </p>
      <p>
        {{ movie.Type }}
      </p>
    </div>
    <img :src="movie.Poster" class="w-[200px]" />
  </div>
</template>
