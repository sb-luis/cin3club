import { defineStore, acceptHMRUpdate } from 'pinia';
import { useMainStore } from './MainStore';
import Joi from 'joi';

export const useMovieStore = defineStore('MovieStore', {
  state: () => {
    return {
      isLoading: false,
      selectedMovie: {},
      selectedMovieRatings: [],
      movies: [],
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
        await this.refreshMovieRatings();
      } catch (err) {
        console.error(err);
      }
      this.isLoading = false;
    },
    //  --- MOVIE RATINGS ---
    async refreshMovieRatings() {
      this.isLoading = true;
      try {
        await this.getMovieRatings();
      } catch (err) {
        console.log(err);
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
  },
});

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMovieStore, import.meta.hot));
}
