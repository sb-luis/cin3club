// ESM doesn't support JSON imports
import Joi from 'joi';
import { URL_QUERY_STR_MAX } from '../../server/constants.js';

// --- PUBLIC MOVIES AND TV SHOWS ENDPOINTS ---

export default [
  // SEARCH MOVIES AND TV SHOWS - public
  {
    method: 'get',
    path: '/api/media',
    handler: async (request, h) => {
      const { s, lang } = request.query;
      const { tmdbService } = request.services();
      try {
        const movies = await tmdbService.getMedia({ s, lang });
        return movies;
      } catch (err) {
        request.log('err', err);
      }
    },
    options: {
      auth: false,
      validate: {
        query: Joi.object({
          s: Joi.string().max(URL_QUERY_STR_MAX).required(),
          lang: Joi.string().max(URL_QUERY_STR_MAX).default('en'),
        }).options({ stripUnknown: true }),
      },
    },
  },
  // GET MOVIE DETAILS - public
  {
    method: 'GET',
    path: '/api/media/movie/{id}',
    handler: async (request, h) => {
      const { id } = request.params;
      const { lang } = request.query;
      const { tmdbService } = request.services();

      try {
        const movieDetails = await tmdbService.getMovieDetails({ id, lang });
        return movieDetails;
      } catch (err) {
        request.log('err', err);
      }
    },
    options: {
      auth: false,
      validate: {
        query: Joi.object({
          lang: Joi.string().max(URL_QUERY_STR_MAX).default('en'),
        }).options({ stripUnknown: true }),
        params: Joi.object({
          id: Joi.string().max(URL_QUERY_STR_MAX).required(),
        }),
      },
    },
  },
  // GET TV SHOW DETAILS - public
  {
    method: 'GET',
    path: '/api/media/tv/{id}',
    handler: async (request, h) => {
      const { id } = request.params;
      const { lang } = request.query;
      const { tmdbService } = request.services();

      try {
        const tvShowDetails = await tmdbService.getTvShowDetails({ id, lang });
        return tvShowDetails;
      } catch (err) {
        request.log('err', err);
      }
    },
    options: {
      auth: false,
      validate: {
        query: Joi.object({
          lang: Joi.string().max(URL_QUERY_STR_MAX).default('en'),
        }).options({ stripUnknown: true }),
        params: Joi.object({
          id: Joi.string().max(URL_QUERY_STR_MAX).required(),
        }),
      },
    },
  },
];
