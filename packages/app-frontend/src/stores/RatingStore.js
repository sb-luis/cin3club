import { defineStore, acceptHMRUpdate } from 'pinia';
import { useMainStore } from './MainStore';
import Joi from 'joi';

export const useRatingStore = defineStore('RatingStore', {
  state: () => {
    return {
      isLoading: false,
      selectedRating: {},
      ratings: [],
      ratingsTotal: 0,
      sortType: 'score', // score / dateSeen
      sortOrder: 'desc', // asc / desc
      currentPage: 1,
      pageSize: 10,
    };
  },
  getters: {
    totalPages: (state) => Math.ceil(state.ratingsTotal / state.pageSize),
  },
  actions: {
    async populateRatingStoreFromQuery(query) {
      console.log('Populating query state from query');

      if (!query.page) {
        console.log("No 'page' query param, using default page");
      } else {
        this.currentPage = parseInt(query.page);
      }

      if (!query.sortOrder) {
        console.log("No 'sortOrder' query param, using default sort order");
      } else {
        this.sortOrder = query.sortOrder;
      }

      if (!query.sortType) {
        console.log("No 'sortType' query param, using default sort type");
      } else {
        this.sortType = query.sortType;
      }
    },
    //  --- RATINGS ---
    async toggleRatingsSort() {
      // if changing sort order, reset page
      this.currentPage = 1;
      this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
    },
    async getAllRatings() {
      const mainStore = useMainStore();
      this.isLoading = true;

      try {
        // GET ALL RATINGS
        const url = `/api/ratings?page=${this.currentPage}&sortOrder=${this.sortOrder}&sortType=${this.sortType}&lang=${mainStore.lang}`;
        console.log(`GET ${url}`);
        const res = await this.$axios.get(url);
        console.log(res.data);
        this.ratings = res.data.ratings;
        this.ratingsTotal = res.data.total;
      } catch (err) {
        console.error(err);
      }
      this.isLoading = false;
    },
    async createRating({ dateSeen, score, mediaItem }) {
      const mainStore = useMainStore();
      this.isLoading = true;

      console.log('Creating Rating!');
      console.log(mediaItem);

      try {
        // CREATE MOVIE RATING
        const data = {
          score: score,
          dateSeen: dateSeen,
          mediaItem: {
            mediaType: mediaItem.mediaType,
            tmdbId: mediaItem.tmdbId,
          },
        };

        const res = await this.$axios.post(`/api/ratings`, data);
      } catch (err) {
        console.error(err);
      }
      this.isLoading = false;
    },
    async updateRating({ dateSeen, score }) {
      const mainStore = useMainStore();
      this.isLoading = true;

      try {
        // CREATE MOVIE RATING
        const res = await this.$axios.put(`/api/ratings/${this.selectedRating.id}`, {
          score: score,
          dateSeen: dateSeen,
        });
      } catch (err) {
        console.error(err);
      }
      this.isLoading = false;
    },
    async deleteRating() {
      const mainStore = useMainStore();
      this.isLoading = true;
      try {
        // DELETE MOVIE RATING
        const res = await this.$axios.delete(`/api/ratings/${this.selectedRating.id}`);
      } catch (err) {
        console.error(err);
      }
      this.isLoading = false;
    },
  },
});

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRatingStore, import.meta.hot));
}
