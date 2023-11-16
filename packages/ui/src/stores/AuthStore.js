import { defineStore, acceptHMRUpdate } from 'pinia';

export const useAuthStore = defineStore('AuthStore', {
  state: () => {
    return {
      isLoading: false,
      credentials: null,
    };
  },
  actions: {
    async register(username, password) {
      this.isLoading = true;

      const res = await this.$axios.post('/register', { username, password });
      this.credentials = res.data;
      console.log('User registered');
      this.$router.replace({ path: '/' });

      this.isLoading = false;
    },
    async login(username, password) {
      this.isLoading = true;

      const res = await this.$axios.post('/login', { username, password });
      this.credentials = res.data;
      // Redirect to home
      this.$router.replace({ path: '/' });
      console.log('User logged in');

      this.isLoading = false;
    },
    async logout() {
      this.isLoading = true;

      console.log('logging user out');

      // Send logout request to the server
      const res = await this.$axios.get('/logout');
      if (res.status !== 200) return console.log(`Authentication request failed: ${res.status}`);

      // Remove credentials from store
      credentials.value = null;
      // Redirect to home
      console.log('User logged out');

      this.$router.replace({ path: '/' });
      this.isLoading = false;
    },
    async loadCredentials() {
      console.log('trying to load credentials...');

      this.isLoading = true;

      const entryPath = this.$router.options.history.state.current;
      // Get credentials from the server
      const res = await this.$axios.get('/auth/me');
      if (![200, 204].includes(res.status))
        return console.log(`Authentication request failed: ${res.status}`);
      // Store credentials
      this.credentials = res.data;
      // Redirect to entry location
      this.$router.replace(entryPath);

      console.log('printing credentials');
      console.log(this.credentials);

      this.isLoading = false;
    },
  },
});

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
