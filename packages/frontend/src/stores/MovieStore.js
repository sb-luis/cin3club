import { defineStore, acceptHMRUpdate } from 'pinia';
import { useMainStore } from './MainStore';
import Joi from 'joi';

export const useMovieStore = defineStore('MovieStore', {
  state: () => {
    return {
      isLoading: false,
      movies: [],
      movieDetails: {},
      searchQuery: '',
      searchQuerySchema: Joi.string().min(3).max(50).required().label('search query'),
      searchQueryError: '',
    };
  },
  actions: {
    async validateQuery() {
      this.searchQueryError = '';

      // Update router with last query
      this.$router.replace({ path: '/movies', query: { s: this.searchQuery } });

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
        console.log(this.movies);
      } catch (err) {
        console.error(err);
      }
      this.isLoading = false;
    },
    async rateMovie({ id, rating, dateSeen }) {
      this.isLoading = true;
      // Send request
      try {
        const res = await this.$axios.post(`/api/ratings/${id}`, { dateSeen, rating });
        console.log('movie rated!');
        console.log(res.data);
        //this.movieDetailsCache[id] = res.data;
      } catch (err) {
        console.error(err);
      }
      this.isLoading = false;
    },
    async getMovieDetails(id) {
      const mainStore = useMainStore();

      this.isLoading = true;
      // Send request
      try {
        const url = `/api/movies/${id}?lang=${mainStore.lang}`;
        console.log(url);
        const res = await this.$axios.get(url);
        this.movieDetails = res.data;
        console.log(this.movieDetails);
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
