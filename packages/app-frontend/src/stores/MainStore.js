import { defineStore, acceptHMRUpdate } from 'pinia';

export const useMainStore = defineStore('MainStore', {
  state: () => {
    return {
      lang: 'en', // english / spanish
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

      if (query?.theme === 'dark' || query?.theme === 'light') {
        console.log(`Setting theme to '${query.theme}'`);
        this.theme = query.theme;
      } else {
        console.log("No 'theme' query param, using default theme");
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
      if (lang === 'en' || lang === 'es') {
        this.lang = lang;
        this.$i18next.changeLanguage(this.lang);
      }
    },
    async applyTheme() {
      console.log(`Setting theme to '${this.theme}'`);
      if (this.theme === 'dark') {
        document.body.classList.add('dark');
      } else if (this.theme === 'light') {
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
      this.theme = theme;
      this.applyTheme(theme);
      this.retriggerNavigation();
    },
  },
});

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot));
}
