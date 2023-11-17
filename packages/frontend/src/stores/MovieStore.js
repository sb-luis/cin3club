import { defineStore, acceptHMRUpdate } from 'pinia';
import Joi from 'joi';

export const useMovieStore = defineStore('MovieStore', {
  state: () => {
    return {
      isLoading: false,
      movieDetailsCache: {},
      movies: [],
      querySchema: Joi.string().min(3).max(50).required(),
      queryValue: '',
      queryError: '',
    };
  },
  actions: {
    async getMovies() {
      // Validate query
      const { value, error } = this.querySchema.validate(this.queryValue);
      if (error) {
        return (this.queryError = error.message);
      }

      this.queryError = '';
      this.isLoading = true;
      // Send request
      const s = encodeURIComponent(this.queryValue);

      // Send request
      try {
        const res = await this.$axios.get(`/api/movies?s=${s}`);
        this.movies = res.data;
      } catch (err) {
        console.error(err);
      }
      this.isLoading = false;
    },
    async rateMovie({ id }) {
      this.isLoading = true;
      // Send request
      try {
        const res = await this.$axios.post(`/api/movies/${id}`);
        console.log(res.data);
        this.movieDetailsCache[id] = res.data;
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
