import { defineStore, acceptHMRUpdate } from 'pinia';

export const useMovieStore = defineStore('MovieStore', {
  state: () => {
    return {
      isLoading: false,
      movies: [],
    };
  },
  actions: {
    async getMovies() {
      this.isLoading = true;
      const res = await this.$axios.get('/api/movies');
      this.movies = res.data;
      console.log(this.movies);

      this.isLoading = false;
    },
  },
});

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMovieStore, import.meta.hot));
}
