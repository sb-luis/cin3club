import Schmervice from '@hapipal/schmervice';
import axios from 'axios';

// DOCS - http://www.omdbapi.com/

// Rate Limit: 1000 request per day

export default class OmdbApi extends Schmervice.Service {
  async getMovies(searchQuery) {
    this.server.log(['info', 'omdb-api'], `GET movies named '${searchQuery}'`);

    const res = await axios.get(`http://www.omdbapi.com/?s=${searchQuery}&page=1&apikey=${process.env.MOVIE_API_KEY}`);

    let data = [];

    if (res.data?.Search?.length) {
      data = res.data.Search.filter((item) => item.Poster && item.Poster !== 'N/A').map((item) => {
        return {
          id: item.imdbID,
          title: item.Title,
          releaseDate: `${item.Year}-01-01`,
          posterPath: item.Poster,
        };
      });
    }

    return data;
  }

  async getMovieDetails(id) {
    this.server.log(['info', 'omdb-api'], `GET movie details for '${id}'`);

    const res = await axios.get(`http://www.omdbapi.com/?i=${id}&apikey=${process.env.MOVIE_API_KEY}`);

    return res.data;
  }
}
