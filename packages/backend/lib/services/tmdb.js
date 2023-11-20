import Schmervice from '@hapipal/schmervice';
import axios from 'axios';

// DOCS - https://developer.themoviedb.org/docs

// Rate Limit: ~50 requests per second
// Will return HTTP 429 'Too Many Requests' if surpassed
// https://developer.themoviedb.org/docs/rate-limiting

export default class TmdbService extends Schmervice.Service {
  async getMovies({ s, lang }) {
    this.server.log(['info', 'tmdb-service'], `GET movies named '${s}' in lang '${lang}'`);

    // Fetch data from TMDB
    const url = `${process.env.TMDB_ENDPOINT}/search/movie?query=${s}&language=${lang}&page=1`;

    const res = await axios.get(url, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_KEY}`,
      },
    });

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

  async getMovieDetails({ id, lang = 'en-GB' }) {
    this.server.log(['info', 'tmdb-service'], `GET movie details for '${id}' in lang '${lang}'`);

    // Fetch data from TMDB
    const httpOptions = {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_KEY}`,
      },
    };
    const movieDetailsUrl = `${process.env.TMDB_ENDPOINT}/movie/${id}?language=${lang}`;
    const movieCreditsUrl = `${process.env.TMDB_ENDPOINT}/movie/${id}/credits`;

    const res = await Promise.all([axios.get(movieDetailsUrl, httpOptions), axios.get(movieCreditsUrl, httpOptions)]);

    const data = { ...res[0].data, ...res[1].data };

    let movieDetails = {
      // same as lister
      englishTitle: data.title,
      originalTitle: data.original_title,
      releaseDate: data.release_date, // y-m-d
      posterPath: data.poster_path,
      // additional
      description: data.overview,
      runningTime: data.runtime, // minutes
      genres: data.genres.map((i) => i.name),
      productionCountries: data.production_countries.map((i) => i.name),
      productionCompanies: data.production_companies.map((i) => ({
        name: i.name,
        country: i.origin_country,
      })),
      languages: data.spoken_languages.map((item) => item.iso_639_1),
      status: data.status,
      budget: data.budget,
      revenue: data.revenue,
      imdbId: data.imdb_id,
      tmdbId: data.id,
      directors: data.crew.filter((i) => i.job === 'Director').map((i) => i.original_name),
      cast: data.cast.slice(0, 5).map((i) => ({ name: i.original_name, character: i.character })),
    };

    return movieDetails;
  }
}
