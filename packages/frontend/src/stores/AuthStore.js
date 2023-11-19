import { defineStore, acceptHMRUpdate } from 'pinia';
import { useMainStore } from './MainStore';

export const useAuthStore = defineStore('AuthStore', {
  state: () => {
    return {
      isLoading: false,
      credentials: null,
    };
  },
  actions: {
    async register(alias, password) {
      this.isLoading = true;
      const mainStore = useMainStore();

      try {
        const res = await this.$axios.post('/auth/register', { alias, password });
        await this.loadCredentials();
        this.$router.replace({ path: '/', query: { lang: mainStore.lang } });
      } catch (err) {
        console.error(err);
      }

      this.isLoading = false;
    },
    async login(alias, password) {
      this.isLoading = true;
      const mainStore = useMainStore();

      const res = await this.$axios.post('/auth/login', { alias, password });

      await this.loadCredentials();

      // Redirect to home
      this.$router.replace({ path: '/', query: { lang: mainStore.lang } });
      this.isLoading = false;
    },
    async logout() {
      this.isLoading = true;
      const mainStore = useMainStore();
      // Send logout request to the server
      const res = await this.$axios.get('/auth/logout');
      if (res.status !== 200) {
        return console.log(`Authentication request failed: ${res.status}`);
      }

      // Remove credentials from store
      this.credentials = null;
      // Redirect to home
      this.$router.replace({ path: '/', query: { lang: mainStore.lang } });
      this.isLoading = false;
    },
    async loadCredentials() {
      this.isLoading = true;
      const mainStore = useMainStore();

      try {
        const entryPath = this.$router.options.history.state.current;
        // Get credentials from the server
        const res = await this.$axios.get('/auth/me');
        if (![200, 204].includes(res.status)) return console.log(`Authentication request failed: ${res.status}`);
        // Store credentials
        this.credentials = res.data;
        // Redirect to entry location
        this.$router.replace({ path: entryPath, query: { lang: mainStore.lang } });
      } catch (err) {
        console.error(err);
      }

      this.isLoading = false;
    },
  },
});

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
