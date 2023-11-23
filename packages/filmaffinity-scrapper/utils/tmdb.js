import axios from 'axios';

export const getMovies = async ({ s, lang = 'en-GB' }) => {
  // Search films data from TMDB@3
  const url = `${process.env.TMDB_ENDPOINT}/search/movie?query=${s}&language=${lang}&page=1`;

  const res = await axios.get(url, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_KEY}`,
    },
  });

  let data = [];

  // Films schema mappings
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
};

export const getMovieDetails = async ({ id, lang = 'en-GB' }) => {
  // Fetch film details from TMDB@3
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

  // Films detais schema mappings
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
};

export const getTvShows = async ({ s, lang = 'en-GB' }) => {
  // Fetch TV data
  const tvUrl = `${process.env.TMDB_ENDPOINT}/search/tv?query=${s}&language=${lang}&page=1`;

  const tvResponse = await axios.get(tvUrl, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_KEY}`,
    },
  });
  let tvData = [];

  // Data schema mappings (TMDB@3 to Kino)
  if (tvResponse.data?.results?.length) {
    tvData = tvResponse.data.results
      .filter(
        (item) =>
          item.name !== '' &&
          item.original_name !== '' &&
          item.poster_path &&
          item.first_air_date &&
          item.first_air_date !== '',
      )
      .map((item) => {
        return {
          id: item.id,
          englishTitle: item.name,
          originalTitle: item.original_name,
          releaseDate: item.first_air_date, //YYYY-MM-DD
          posterPath: item.poster_path,
          type: 'tv',
        };
      });
  }

  return tvData;
};

export const getTvShowDetails = async ({ id, lang = 'en-GB' }) => {
  // Fetch TV Show Details from TMDB
  const httpOptions = {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_KEY}`,
    },
  };
  const movieDetailsUrl = `${process.env.TMDB_ENDPOINT}/tv/${id}?language=${lang}`;
  const movieCreditsUrl = `${process.env.TMDB_ENDPOINT}/tv/${id}/credits`;

  const res = await Promise.all([axios.get(movieDetailsUrl, httpOptions), axios.get(movieCreditsUrl, httpOptions)]);

  const data = { ...res[0].data, ...res[1].data };

  let tvDetails = {
    // same as lister
    englishTitle: data.name,
    originalTitle: data.original_name,
    releaseDate: data.first_air_date, // y-m-d
    lastAirDate: data.last_air_date,
    seasons: data.number_of_seasons,
    episodes: data.number_of_episodes,
    posterPath: data.poster_path,
    // additional
    description: data.overview,
    episodeRuntime: data.episode_runtime, // episode minutes
    genres: data.genres.map((i) => i.name),
    productionCountries: data.production_countries.map((i) => i.name),
    productionCompanies: data.production_companies.map((i) => ({
      name: i.name,
      country: i.origin_country,
    })),
    languages: data.spoken_languages.map((item) => item.iso_639_1),
    status: data.status,
    tmdbId: data.id,
    createdBy: data.created_by.map((i) => i.name),
    directors: data.crew.filter((i) => i.job === 'Director').map((i) => i.original_name),
    cast: data.cast.slice(0, 5).map((i) => ({ name: i.original_name, character: i.character })),
  };

  return tvDetails;
};
