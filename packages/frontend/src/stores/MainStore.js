import { defineStore, acceptHMRUpdate } from 'pinia';

export const useMainStore = defineStore('MainStore', {
  state: () => {
    return {
      lang: 'en-gb', // en-gb / es-spa
      theme: 'light', // dark / light
    };
  },
  actions: {
    async populateAppStateFromQuery(query) {
      console.log('Populating app state from query');

      if (!query.lang) {
        console.log("No 'lang' query param, using default language");
      } else {
        this.setLang(query.lang);
      }

      if (!query.theme) {
        console.log("No 'theme' query param, using default theme");
      } else {
        this.setTheme(query.theme);
      }
    },
    async navigate({ path, query = {}, replace = false }) {
      console.log('mainStore.navigate was called');
      const route = this.$router.currentRoute;

      const programaticQuery = { ...query, lang: this.lang, theme: this.theme };

      this.$router.push({ path, query: { ...programaticQuery }, replace });
    },
    async retriggerNavigation() {
      console.log(`Retriggering nav to populate query`);
      const route = this.$router.currentRoute;
      this.navigate({ path: route.path, replace: true });
    },
    async setLang(lang) {
      console.log(`Setting lang to '${lang}'`);
      if (lang === 'en-gb' || lang === 'es-spa') {
        this.lang = lang;
        this.$i18next.changeLanguage(this.lang);
      }
    },
    async setTheme(theme) {
      console.log(`Setting theme to '${theme}'`);
      if (theme === 'dark') {
        this.theme = theme;
        document.body.classList.add('dark');
      } else if (theme === 'light') {
        this.theme = theme;
        document.body.classList.remove('dark');
      }
    },
    async updateLang(lang) {
      console.log(`Updating lang`);
      this.setLang(lang);
      this.retriggerNavigation();
    },
    async toggleTheme() {
      console.log(`Updating theme`);
      const theme = this.theme === 'dark' ? 'light' : 'dark';
      this.setTheme(theme);
      this.retriggerNavigation();
    },
  },
});

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot));
}
