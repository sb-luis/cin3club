import Schmervice from '@hapipal/schmervice';
import axios from 'axios';

// DOCS - http://www.omdbapi.com/

// Rate Limit: 1000 request per day

export default class OmdbService extends Schmervice.Service {
  async getMovies(searchQuery) {
    this.server.log(['info', 'omdb-service'], `GET movies named '${searchQuery}'`);

    // Fetch movies from OMDB
    const res = await axios.get(`${process.env.OMDB_ENDPOINT}/?s=${searchQuery}&page=1&apikey=${process.env.OMDB_KEY}`);

    let data = [];

    // Data schema mappings (OMDB to Cin3club)
    if (res.data?.Search?.length) {
      data = res.data.Search.filter((item) => item.Poster && item.Poster !== 'N/A').map((item) => {
        return {
          id: item.imdbID,
          englishTitle: item.Title,
          releaseDate: `${item.Year}-01-01`,
          posterPath: item.Poster,
        };
      });
    }

    return data;
  }

  async getMovieDetails(id) {
    this.server.log(['info', 'omdb-service'], `GET movie details for '${id}'`);

    // Fetch movie details from OMDB
    const res = await axios.get(`${process.env.OMDB_ENDPOINT}/?i=${id}&apikey=${process.env.OMDB_KEY}`);

    return res.data;
  }
}
