<script setup>
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/AuthStore';
import { useMainStore } from '../stores/MainStore';
import { onClickOutside } from '@vueuse/core';
// https://vueuse.org/core/onClickOutside/
import GoIcon from './base/GoIcon.vue';
import NavLink from './NavLink.vue';

const authStore = useAuthStore();
const mainStore = useMainStore();
const { credentials } = storeToRefs(authStore);

const langMenuIsOpen = ref(false);
const reactiveTabIndex = ref(0);
const langMenu = ref(null);
const navDrawer = ref(null);

onClickOutside(langMenu, () => (langMenuIsOpen.value = false));
onClickOutside(navDrawer, () => (navbarDrawerIsOpen.value = false));

const toggleLangMenu = (e) => {
  e.preventDefault();
  langMenuIsOpen.value = !langMenuIsOpen.value;
};

const handleLangChange = (e, lang) => {
  mainStore.updateLang(lang);
};

const navbarDrawerIsOpen = ref(false);

const hideNavDrawer = () => {
  navbarDrawerIsOpen.value = false;
};
</script>

<template>
  <nav class="fixed left-0 top-0 z-10 flex w-full select-none items-center justify-between bg-neutral-100/90 px-3 py-1">
    <!-- NAVBAR START -->
    <div class="flex items-center space-x-2">
      <h1 class="bg-primary-950 px-2 text-2xl font-black uppercase text-neutral-200">{{ $t('app.title') }}</h1>
    </div>

    <!-- DESKTOP NAV -->
    <div class="margin-auto hidden max-w-5xl flex-1 items-center justify-between pl-[5%] pr-4 md:flex lg:pr-6 xl:pl-28">
      <div class="space-x-2">
        <NavLink @click="hideNavDrawer" path="/">{{ $t('app.nav.mediaItemSearchLink') }}</NavLink>
        <NavLink v-if="authStore.credentials" @click="hideNavDrawer" path="/ratings">
          {{ $t('app.nav.ratingsLink') }}</NavLink>
        <NavLink v-if="authStore.credentials" @click="hideNavDrawer" path="/lists">
          {{ $t('app.nav.listsLink') }}</NavLink>
      </div>
      <template v-if="authStore.credentials">
        <NavLink @click="hideNavDrawer" path="/logout">{{ $t('app.nav.logoutLink') }}</NavLink>
      </template>
      <div class="space-x-2" v-else>
        <NavLink @click="hideNavDrawer" path="/login">{{ $t('app.nav.loginLink') }}</NavLink>
        <NavLink @click="hideNavDrawer" path="/register">{{ $t('app.nav.registerLink') }}</NavLink>
      </div>
    </div>

    <!-- NAVBAR END -->
    <div class="flex w-44 items-center justify-between md:w-32">
      <!-- TOGGLE LOCALE -->
      <details ref="langMenu" :open="langMenuIsOpen" @click="toggleLangMenu" class="mr-2 w-60">
        <summary>{{ $t('app.nav.langSelectionLabel') }}</summary>
        <ul class="rounded-box absolute z-[1] mt-2 w-40 space-y-2 rounded-2xl bg-neutral-100 p-3 shadow">
          <li :class="{ '!text-primary-900': mainStore.lang === 'en' }">
            <button class="w-full text-start" @click="(e) => handleLangChange(e, 'en')">
              {{ $t('app.nav.englishOptionLabel') }}
            </button>
          </li>
          <li :class="{ 'text-primary-900': mainStore.lang === 'es' }">
            <button class="w-full text-start" @click="(e) => handleLangChange(e, 'es')">
              {{ $t('app.nav.spanishOptionLabel') }}
            </button>
          </li>
        </ul>
      </details>

      <!-- TOGGLE THEME -->
      <button @click="mainStore.toggleTheme()" class="relative flex h-10 w-10 cursor-pointer items-center justify-center">
        <GoIcon class="absolute rotate-90 transition-all duration-500" name="light_mode"
          :class="{ 'invisible rotate-[360] opacity-0': mainStore.theme !== 'light' }" />
        <GoIcon class="absolute rotate-[360] transition-all duration-500" name="dark_mode"
          :class="{ 'invisible rotate-[720deg] opacity-0': mainStore.theme !== 'dark' }" />
      </button>

      <!-- NAVBAR DRAWER -->
      <button class="block md:hidden" @click="() => (navbarDrawerIsOpen = true)">
        <GoIcon class="cursor-pointer p-2" name="more_vert" />
      </button>

      <div class="absolute left-0 top-0 h-screen w-full" :class="{ 'pointer-events-none': !navbarDrawerIsOpen }">
        <div class="absolute left-0 top-0 h-full w-full bg-neutral-200/90" :class="{ hidden: !navbarDrawerIsOpen }"></div>
        <div ref="navDrawer" class="absolute h-screen w-0 overflow-hidden bg-neutral-100 transition-all duration-500"
          :class="{ '!w-60': navbarDrawerIsOpen }">
          <div class="space-y-3 overflow-hidden">
            <!-- NAVBAR DRAWER CONTENT -->
            <div class="flex flex-col space-y-2 p-5">
              <NavLink @click="hideNavDrawer" class="text-xl" path="/">{{ $t('app.nav.mediaItemSearchLink') }}</NavLink>
              <template v-if="authStore.credentials">
                <NavLink @click="hideNavDrawer" class="text-xl" path="/ratings">
                  {{ $t('app.nav.ratingsLink') }}</NavLink>
                <NavLink @click="hideNavDrawer" class="text-xl" path="/lists">
                  {{ $t('app.nav.listsLink') }}</NavLink>
                <NavLink @click="hideNavDrawer" class="text-xl" path="/logout">{{ $t('app.nav.logoutLink') }}</NavLink>
              </template>
              <template v-else>
                <NavLink @click="hideNavDrawer" class="text-xl" path="/login">{{ $t('app.nav.loginLink') }}</NavLink>
                <NavLink @click="hideNavDrawer" class="text-xl" path="/register">{{
                  $t('app.nav.registerLink')
                }}</NavLink>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
