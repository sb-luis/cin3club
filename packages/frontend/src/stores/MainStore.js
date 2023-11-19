import { defineStore, acceptHMRUpdate } from 'pinia';

export const useMainStore = defineStore('MainStore', {
  state: () => {
    return {
      lang: 'es-spa', // en-gb / es-spa
      theme: 'dark', // dark / light
    };
  },
  actions: {
    async setLang(lang) {
      this.lang = lang;
      this.$i18next.changeLanguage(lang);
    },
    async toggleLang() {
      this.lang = this.lang === 'en-gb' ? 'es-spa' : 'en-gb';
      this.$router.replace({ path: this.$router.currentRoute.path, query: { lang: this.lang } });
      this.setLang(this.lang);
    },
    async toggleTheme() {
      this.lang = this.lang === 'dark' ? 'light' : 'dark';
    },
  },
});

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot));
}
