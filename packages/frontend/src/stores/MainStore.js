import { defineStore, acceptHMRUpdate } from 'pinia';

export const useMainStore = defineStore('MainStore', {
  state: () => {
    return {
      renderModal: false,
      currentContext: '',
      lang: 'en-gb', // en-gb / es-spa
      theme: 'dark', // dark / light
    };
  },
  actions: {
    async setLang(lang) {
      if (lang === 'en-gb' || lang === 'es-spa') {
        this.lang = lang;
        this.$i18next.changeLanguage(lang);
      }
    },
    async toggleLang() {
      this.lang = this.lang === 'en-gb' ? 'es-spa' : 'en-gb';
      this.$router.replace({ path: this.$router.currentRoute.path, query: { lang: this.lang } });
      this.setLang(this.lang);
    },
    async toggleTheme() {
      this.lang = this.lang === 'dark' ? 'light' : 'dark';
    },
    async setCurrentContext(context) {
      this.currentContext = context;

      // context that are handled by modals
      if (context === 'createRating' || context === 'updateRating') {
        this.renderModal = true;
      }
    },
    async hideModal() {
      this.modalAction = '';
      this.renderModal = false;
    },
  },
});

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot));
}
