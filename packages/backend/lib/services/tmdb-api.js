import Schmervice from '@hapipal/schmervice';
import axios from 'axios';

// DOCS - https://developer.themoviedb.org/docs

// Rate Limit: ~50 requests per second
// Will return HTTP 429 'Too Many Requests' if surpassed
// https://developer.themoviedb.org/docs/rate-limiting

export default class TmdbApi extends Schmervice.Service {
  async getMovies(searchQuery) {
    this.server.log(['info', 'tmdb-api'], `GET movies named '${searchQuery}'`);

    // Fetch data from TMDB
    const url = `${process.env.TMDB_ENDPOINT}/search/movie?query=${searchQuery}&page=1`;

    const res = await axios.get(url, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_KEY}`,
      },
    });

    console.log(res.status);
    console.log(res.data);

    let data = [];

    // Data schema mappings (TMDB@3 to Kino)
    if (res.data?.results?.length) {
      data = res.data.results
        .filter(
          (item) =>
            item.title !== '' &&
            item.original_title !== '' &&
            item.poster_path &&
            item.release_date &&
            item.release_date !== '',
        )
        .map((item) => {
          return {
            id: item.id,
            englishTitle: item.title,
            originalTitle: item.original_title,
            releaseDate: item.release_date,
            posterPath: item.poster_path,
          };
        });
    }

    return data;
  }

  async getMovieDetails(id) {
    this.server.log(['info', 'tmdb-api'], `GET movie details for '${id}'`);

    return {};
  }
}
