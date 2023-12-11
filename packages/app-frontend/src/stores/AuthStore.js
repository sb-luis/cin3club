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
        const res = await this.$axios.post('/api/auth/register', { alias, password });
        await this.loadCredentials();
        // Redirect to home
        mainStore.navigate({ path: '/', replace: true });
      } catch (err) {
        console.error(err);
      }

      this.isLoading = false;
    },
    async login(alias, password) {
      this.isLoading = true;
      this.isLoading = true;
      const mainStore = useMainStore();

      const res = await this.$axios.post('/api/auth/login', { alias, password });

      await this.loadCredentials();

      // Redirect to home
      mainStore.navigate({ path: '/', replace: true });
      this.isLoading = false;
    },
    async logout() {
      this.isLoading = true;
      const mainStore = useMainStore();
      // Send logout request to the server
      const res = await this.$axios.get('/api/auth/logout');
      if (res.status !== 200) {
        return console.log(`Authentication request failed: ${res.status}`);
      }

      // Remove credentials from store
      this.credentials = null;
      // Redirect to home
      mainStore.navigate({ path: '/', replace: true });
      this.isLoading = false;
    },
    async loadCredentials(entryPath = '/') {
      console.log('Loading user credentials!');
      this.isLoading = true;
      const mainStore = useMainStore();

      try {
        // Get credentials from the server
        const res = await this.$axios.get('/api/auth/me');
        if (![200, 204].includes(res.status)) return console.log(`Authentication request failed: ${res.status}`);
        // Store credentials
        this.credentials = res.data;
        // Redirect to current page, with credentials loaded
        mainStore.navigate({ path: entryPath, replace: true });
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
