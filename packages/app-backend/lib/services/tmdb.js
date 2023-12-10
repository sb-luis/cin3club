import Schmervice from '@hapipal/schmervice';
import axios from 'axios';

// DOCS - https://developer.themoviedb.org/docs

// Rate Limit: ~50 requests per second
// Will return HTTP 429 'Too Many Requests' if surpassed
// https://developer.themoviedb.org/docs/rate-limiting

export default class TmdbService extends Schmervice.Service {
  async getMedia({ s, lang = 'en', page = 1 }) {
    this.server.log(['info', 'tmdb-service'], `GET medi items named '${s}' in lang '${lang}'`);

    // Fetch data from TMDB
    const url = `${process.env.TMDB_ENDPOINT}/search/multi?query=${s}&language=${lang}&page=${page}`;

    const res = await axios.get(url, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_KEY}`,
      },
    });

    let data = [];

    // Data schema mappings (TMDB@3 to Cin3club)
    if (res.data?.results?.length) {
      data = res.data.results
        .filter(
          (item) =>
            (item.media_type === 'movie' || item.media_type === 'tv') &&
            (item.title || item.name) &&
            (item.original_title || item.original_name) &&
            item.poster_path &&
            (item.release_date || item.first_air_date),
        )
        .map((item) => {
          let d = item.release_date || item.first_air_date;
          d = new Date(d);
          const releaseYear = d.getFullYear();

          return {
            mediaType: item.media_type,
            tmdbId: item.id,
            originalTitle: item.original_title || item.original_name,
            releaseYear,
            title: item.title || item.name,
            posterPath: item.poster_path,
            overview: item.overview,
          };
        });
    }

    return data;
  }

  async getMovieDetails({ id, lang = 'en' }) {
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

    // Intentionally run these sequentially to not overload the API
    const res1 = await axios.get(movieDetailsUrl, httpOptions);
    const res2 = await axios.get(movieCreditsUrl, httpOptions);
    const data = { ...res1.data, ...res2.data };

    let d = new Date(data.release_date);
    const releaseYear = d.getFullYear();

    let movieDetails = {
      // same as lister
      tmdbId: data.id,
      originalTitle: data.original_title,
      releaseYear,
      posterPath: data.poster_path,
      title: data.title,
      overview: data.overview,
      // additional
      runtime: data.runtime, // minutes
      genres: data.genres, // { id, name }
      productionCompanies: data.production_companies.map((i) => ({
        id: i.id,
        name: i.name,
        country: i.origin_country, // Country Codes https://www.iso.org/iso-3166-country-codes.html
      })),
      imdbId: data.imdb_id,
      directors: data.crew.filter((i) => i.job === 'Director').map((i) => i.original_name),
      cast: data.cast.slice(0, 5).map((i) => ({ name: i.original_name, character: i.character })),
    };

    return movieDetails;
  }

  async getTvShowDetails({ id, lang = 'en' }) {
    this.server.log(['info', 'tmdb-service'], `GET tv show details for '${id}' in lang '${lang}'`);

    // Fetch data from TMDB
    const httpOptions = {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_KEY}`,
      },
    };
    const tvDetailsUrl = `${process.env.TMDB_ENDPOINT}/tv/${id}?language=${lang}`;
    const tvCreditsUrl = `${process.env.TMDB_ENDPOINT}/tv/${id}/season/1/episode/1/credits`;
    const externalIdsUrl = `${process.env.TMDB_ENDPOINT}/tv/${id}/external_ids`;

    // Intentionally run these sequentially to not overload the API
    const res1 = await axios.get(tvDetailsUrl, httpOptions);
    const res2 = await axios.get(tvCreditsUrl, httpOptions);
    const res3 = await axios.get(externalIdsUrl, httpOptions);
    const data = { ...res1.data, ...res2.data, ...res3.data };

    let d = new Date(data.first_air_date);
    const releaseYear = d.getFullYear();
    d = new Date(data.last_air_date);
    const lastAirDate = d.getFullYear();

    let tvShowDetails = {
      // same as lister
      tmdbId: data.id,
      originalTitle: data.original_name,
      releaseYear,
      posterPath: data.poster_path,
      title: data.name,
      overview: data.overview,
      // additional
      genres: data.genres, // { id, name }
      lastAirDate,
      status: data.status,
      episodes: data.number_of_episodes,
      seasons: data.number_of_seasons,
      productionCompanies: data.production_companies.map((i) => ({
        id: i.id,
        name: i.name,
        country: i.origin_country, // Country Codes https://www.iso.org/iso-3166-country-codes.html
      })),
      imdbId: data.imdb_id,
      createdBy: data.created_by.map((i) => i.name),
      cast: data.cast.slice(0, 5).map((i) => ({ name: i.original_name, character: i.character })),
    };

    return tvShowDetails;
  }

  // We store some of TMDB data internally for more efficient fetching
  async createMedia({ mediaItem, transaction, supportedLocales = ['en', 'es'] }) {
    console.log('creating media');
    const { MediaItem, MediaItemLang } = this.server.app.models;
    let data = [];

    // Fetch data from TMDB for all supported locales
    for (let i = 0; i < supportedLocales.length; i++) {
      console.log('fetching data from tmdb in all supported locales');
      const lang = supportedLocales[i];
      if (mediaItem.mediaType === 'movie') {
        console.log(`Fetching movie with id ${mediaItem.tmdbId} from TMDB in '${lang}' locale`);
        data[lang] = await this.getMovieDetails({ id: mediaItem.tmdbId, lang });
      } else if (mediaItem.mediaType === 'tv') {
        console.log(`Fetching tv show with id ${mediaItem.tmdbId} from TMDB`);
        data[lang] = await this.getTvShowDetails({ id: mediaItem.tmdbId, lang });
      }
    }

    if (!data.length === 2) throw new Error('No media item found in TMDB.');

    // Create a new MediaItem record with fetched data
    console.log('Creating MediaItem with data:');
    const mediaItemData = {
      mediaType: mediaItem.mediaType, // movie or tv
      tmdbId: mediaItem.tmdbId,
      imdbId: data['en'].imdbId,
      originalTitle: data['en'].originalTitle,
      releaseYear: data['en'].releaseYear,
    };
    console.log(mediaItemData);
    const newMediaItem = await MediaItem.create(mediaItemData, { transaction });
    console.log(newMediaItem);

    // Create a new MediaItemLang record for each supported locale
    const mediaItemLangIds = [];
    for (let i = 0; i < supportedLocales.length; i++) {
      const lang = supportedLocales[i];
      console.log(`Creating MediaItemLang for locale: '${lang}'`);
      const mediaItemLangData = {
        mediaItemId: newMediaItem.id,
        tmdbId: mediaItem.tmdbId,
        lang,
        title: data[lang].title,
        overview: data[lang].overview,
        posterPath: data[lang].posterPath,
      };
      console.log(mediaItemLangData);
      const newMediaItemLang = await MediaItemLang.create(mediaItemLangData, { transaction });
      // Add each locale id to 'mediaItemLangIds' array
      mediaItemLangIds.push(newMediaItemLang.id);
    }

    return newMediaItem;
  }
}
