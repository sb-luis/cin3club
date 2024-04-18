import { defineStore, acceptHMRUpdate } from 'pinia';
import { useMainStore } from './MainStore';
import Joi from 'joi';

export const useMediaStore = defineStore('MediaStore', {
  state: () => {
    return {
      isLoading: false,
      selectedMediaItem: {},
      searchItems: [],
      searchQuery: '',
      searchQuerySchema: Joi.string().min(3).max(50).required().label('search query'),
      searchQueryError: '',
    };
  },
  actions: {
    //  --- MOVIES ---
    async validateQuery() {
      this.searchQueryError = '';
      const mainStore = useMainStore();

      // Update router with last query
      mainStore.navigate({ path: '/', query: { s: this.searchQuery }, replace: true });

      // Validate query
      const { value, error } = this.searchQuerySchema.validate(this.searchQuery);
      if (error) {
        return (this.searchQueryError = error.message);
      }
    },
    async getMediaItems() {
      // Validate query
      const { value, error } = this.searchQuerySchema.validate(this.searchQuery);
      if (error) {
        return (this.searchQueryError = error.message);
      }

      const mainStore = useMainStore();

      this.searchQueryError = '';
      this.isLoading = true;
      // Send request
      const s = encodeURIComponent(this.searchQuery);

      // Send request
      try {
        const res = await this.$axios.get(`/api/media?s=${s}&lang=${mainStore.lang}`);
        console.log(res.data);
        this.searchItems = res.data;
      } catch (err) {
        console.error(err);
      }
      this.isLoading = false;
    },
    async getMediaItemDetails(id, mediaType) {
      console.log(`Getting ${mediaType} details`);
      const mainStore = useMainStore();

      this.isLoading = true;
      try {
        // GET MOVIE DETAILS
        const url = `/api/media/${mediaType}/${id}?lang=${mainStore.lang}`;
        const res = await this.$axios.get(url);
        this.selectedMediaItem = { ...res.data, mediaType };
      } catch (err) {
        console.error(err);
      }
      this.isLoading = false;
    },
  },
});

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMediaStore, import.meta.hot));
}
