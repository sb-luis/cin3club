<script setup></script>

<template>
  <div>
    <h1 class="text-4xl pt-2 py-5">{{ $t('pages.profile.title') }}</h1>
    <section class="space-x-4">
      <RouterLink to="/me">settings</RouterLink>
      <RouterLink to="/me/ratings">ratings</RouterLink>
    </section>

    <section>
      <router-view></router-view>
    </section>
  </div>
</template>

<style scoped></style>
