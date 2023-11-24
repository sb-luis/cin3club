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
      sortOrder: 'DESC',
      currentPage: 1,
      pageSize: 10,
    };
  },
  getters: {
    totalPages: (state) => Math.ceil(state.ratingsTotal / state.pageSize),
  },
  actions: {
    //  --- RATINGS ---
    async toggleRatingsSort() {
      // if changing sort order, reset page
      this.currentPage = 1;
      this.sortOrder = this.sortOrder === 'DESC' ? 'ASC' : 'DESC';
    },
    async getAllRatings() {
      this.isLoading = true;
      try {
        // GET ALL RATINGS
        const res = await this.$axios.get(`/api/ratings?page=${this.currentPage}&sort=${this.sortOrder}`);
        console.log(res.data);
        this.ratings = res.data.ratings;
        this.ratingsTotal = res.data.total;
      } catch (err) {
        console.error(err);
      }
      this.isLoading = false;
    },
    async createRating({ dateSeen, score, movie }) {
      const mainStore = useMainStore();
      this.isLoading = true;
      try {
        // CREATE MOVIE RATING
        const data = {
          score: score,
          dateSeen: dateSeen,
          movie: {
            englishTitle: movie.englishTitle,
            originalTitle: movie.originalTitle,
            releaseDate: movie.releaseDate,
            posterPath: movie.posterPath,
            directors: movie.directors,
            tmdbId: movie.tmdbId,
            imdbId: movie.imdbId,
            genres: movie.genres,
            productionCountries: movie.productionCountries,
            runningTime: movie.runningTime,
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
