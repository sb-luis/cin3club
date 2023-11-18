import Schmervice from '@hapipal/schmervice';

// DOCS - https://developer.themoviedb.org/docs

// Rate Limit: ~50 requests per second
// Will return HTTP 429 'Too Many Requests' if surpassed
// https://developer.themoviedb.org/docs/rate-limiting

export default class TmdbApi extends Schmervice.Service {
  async getMovies(searchQuery) {
    this.server.log(['info', 'tmdb-api'], `GET movies named '${searchQuery}'`);

    // Fetch data from TMDB

    let data = [];

    // Map data to internal movie schema here

    return data;
  }

  async getMovieDetails(id) {
    this.server.log(['info', 'tmdb-api'], `GET movie details for '${id}'`);

    return {};
  }
}
