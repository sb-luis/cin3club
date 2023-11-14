<script setup>
import HelloHapi from './components/HelloHapi.vue';
</script>

<template>
  <header>
    <h1>docker [ vue + hapi + postgresql ]</h1>
  </header>

  <main>
    <HelloHapi server="3000" />
  </main>
</template>

<style>
header {
  text-align: center;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin-bottom: 0.5rem;
}
</style>
