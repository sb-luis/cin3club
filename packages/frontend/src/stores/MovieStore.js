import { defineStore, acceptHMRUpdate } from 'pinia';
import { useMainStore } from './MainStore';
import Joi from 'joi';

export const useMovieStore = defineStore('MovieStore', {
  state: () => {
    return {
      isLoading: false,
      selectedRating: {},
      selectedMovie: {},
      selectedMovieRatings: [],
      movies: [],
      ratings: [],
      ratingsSortOrder: 'DESC',
      ratingsItemsTotal: 0,
      ratingsPageCurrent: 1,
      ratingsPageSize: 10,
      searchQuery: '',
      searchQuerySchema: Joi.string().min(3).max(50).required().label('search query'),
      searchQueryError: '',
    };
  },
  getters: {
    ratingsPageTotal: (state) => Math.ceil(state.ratingsItemsTotal / state.ratingsPageSize),
  },
  actions: {
    //  --- MOVIES ---
    async validateQuery() {
      this.searchQueryError = '';

      // Update router with last query
      this.$router.replace({ path: '/', query: { s: this.searchQuery } });

      // Validate query
      const { value, error } = this.searchQuerySchema.validate(this.searchQuery);
      if (error) {
        return (this.searchQueryError = error.message);
      }
    },
    async getMovies() {
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
        const res = await this.$axios.get(`/api/movies?s=${s}&lang=${mainStore.lang}`);
        this.movies = res.data;
      } catch (err) {
        console.error(err);
      }
      this.isLoading = false;
    },
    async getMovieDetails(id) {
      const mainStore = useMainStore();

      this.isLoading = true;
      try {
        // GET MOVIE DETAILS
        const url = `/api/movies/${id}?lang=${mainStore.lang}`;
        const res = await this.$axios.get(url);
        this.selectedMovie = res.data;
        await this.refreshRatings();
      } catch (err) {
        console.error(err);
      }
      this.isLoading = false;
    },
    //  --- RATINGS ---
    async toggleRatingsSort() {
      // if changing sort order, reset page
      this.ratingsPageCurrent = 1;
      this.ratingsSortOrder = this.ratingsSortOrder === 'DESC' ? 'ASC' : 'DESC';
    },
    async refreshRatings() {
      this.isLoading = true;
      if (this.$router.currentRoute.path.startsWith('/movies')) {
        // Re-fetch movie ratings (movie details)
        await this.getMovieRatings();
      } else {
        // Re-fetch movie ratings (rating lister)
        await this.getAllRatings();
      }
      this.isLoading = false;
    },
    async getAllRatings() {
      this.isLoading = true;
      try {
        // GET ALL RATINGS
        const res = await this.$axios.get(`/api/ratings?page=${this.ratingsPageCurrent}&sort=${this.ratingsSortOrder}`);
        console.log(res.data);
        this.ratings = res.data.ratings;
        this.ratingsItemsTotal = res.data.total;
      } catch (err) {
        console.error(err);
      }
      this.isLoading = false;
    },
    async getMovieRatings() {
      this.selectedMovieRatings = {};
      this.isLoading = true;
      try {
        // GET MOVIE RATINGS
        const res = await this.$axios.get(`/api/ratings/${this.selectedMovie.tmdbId}`);
        this.selectedMovieRatings = res.data;
      } catch (err) {
        console.error(err);
      }
      this.isLoading = false;
    },
    async createRating({ dateSeen, score }) {
      const mainStore = useMainStore();
      this.isLoading = true;
      try {
        // CREATE MOVIE RATING
        const movie = this.selectedMovie;
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
            budget: movie.budget,
            revenue: movie.revenue,
            runningTime: movie.runningTime,
          },
        };

        const res = await this.$axios.post(`/api/ratings`, data);

        mainStore.hideModal();
        await this.refreshRatings();
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

        mainStore.hideModal();
        await this.refreshRatings();
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

        mainStore.hideModal();
        await this.refreshRatings();
      } catch (err) {
        console.error(err);
      }
      this.isLoading = false;
    },
  },
});

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMovieStore, import.meta.hot));
}
