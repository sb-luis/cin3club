<script setup>
import NavBar from '../components/NavBar.vue';
import { useAuthStore } from '../stores/AuthStore';
import { useMainStore } from '../stores/MainStore';
import RatingsForm from '../components/RatingsForm.vue';

const mainStore = useMainStore();

const authStore = useAuthStore();

const date = new Date();
const year = date.getFullYear();
</script>

<template>
  <div class="w-full h-full z-10 relative">
    <!-- MODAL -->
    <div v-if="mainStore.renderModal" class="bg-slate-800 fixed w-full h-full top-0 left-0 z-10 opacity-90">
      <RatingsForm
        v-if="mainStore.currentContext === 'createRating' || mainStore.currentContext === 'updateRating'"
        class="m-auto mt-20 max-w-[400px] p-10 rounded-2xl"
      />
      <button @click="() => mainStore.hideModal()" class="top-5 absolute right-5 border px-2 rounded">BACK</button>
    </div>
    <div
      class="h-full py-2 px-3 m-auto flex flex-col justify-stretch items-center"
      :class="{ blur: mainStore.renderModal }"
    >
      <header class="text-center w-full relative">
        <h1 class="text-5xl text-start font-kaushan">{{ $t('app.title') }}</h1>
        <!-- NAVBAR -->
        <NavBar class="p-2 max-w-[250px] m-auto" />
        <!-- TOGGLE LOCALE -->
        <button @click="() => mainStore.toggleLang()" class="space-x-2 text-neutral-700 fixed top-2 right-5">
          <span :class="{ 'text-white': mainStore.lang === 'en-gb' }"> EN </span>
          <span>/</span>
          <span :class="{ 'text-white': mainStore.lang === 'es-spa' }"> ES </span>
        </button>
      </header>

      <main class="relative flex-1 w-full max-w-4xl">
        <h1 class="uppercase text-blue-500 font-bold text-2xl mb-2">{{ $t(`pages.${$route.name}.title`) }}</h1>
        <router-view v-slot="{ Component, route }">
          <component :is="Component" :key="route.path" />
        </router-view>
      </main>

      <footer class="py-6 text-xs text-center text-gray-500">
        <p>{{ $t('app.footer.license') }}</p>
        <p>{{ $t('app.footer.copyright', { year }) }}</p>
      </footer>
    </div>
  </div>
</template>
