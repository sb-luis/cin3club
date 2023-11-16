import { defineStore, acceptHMRUpdate } from 'pinia';

export const useRequestStore = defineStore('RequestStore', {
  state: () => {
    return {
      isLoading: false,
      requests: [],
    };
  },
  actions: {
    async getRequests() {
      const res = await this.$axios.get('/api/requests');
      this.requests = res.data;
    },
    async postRequest() {
      const res = await this.$axios.post('/api/requests');
      this.getRequests();
    },
    async deleteRequests() {
      const res = await this.$axios.delete('/api/requests');
      this.getRequests();
    },
  },
});

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRequestStore, import.meta.hot));
}
