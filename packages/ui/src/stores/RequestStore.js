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
      console.log('GET /request');
      const res = await this.$axios.get('/api/requests');
      this.requests = res.data;
    },
    async postRequest() {
      console.log('POST /request');
      const res = await this.$axios.post('/api/requests');
      this.getRequests();
    },
    async deleteRequests() {
      console.log('DELETE /request');
      const res = await this.$axios.delete('/api/requests');
      this.getRequests();
    },
  },
});

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRequestStore, import.meta.hot));
}
