// ESM doesn't support JSON imports
import axios from 'axios';
import Joi from 'joi';
import { URL_QUERY_STR_MIN, URL_QUERY_STR_MAX } from '../../server/constants.js';

// --- PUBLIC MOVIE ENDPOINTS ---

export default [
  // GET MOVIES - public
  {
    method: 'get',
    path: '/api/movies',
    handler: async (request, h) => {
      const { s, lang } = request.query;
      const { tmdbService } = request.services();
      try {
        const movies = await tmdbService.getMovies({ s, lang });
        return movies;
      } catch (err) {
        request.log('err', err);
      }
    },
    options: {
      auth: false,
      validate: {
        query: Joi.object({
          s: Joi.string().min(URL_QUERY_STR_MIN).max(URL_QUERY_STR_MAX).required(),
          lang: Joi.string().min(URL_QUERY_STR_MIN).max(URL_QUERY_STR_MAX).required(),
        }).options({ stripUnknown: true }),
      },
    },
  },
  // GET MOVIE DETAILS - public
  {
    method: 'GET',
    path: '/api/movies/{id}',
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
          lang: Joi.string().min(URL_QUERY_STR_MIN).max(URL_QUERY_STR_MAX).required(),
        }).options({ stripUnknown: true }),
        params: Joi.object({
          id: Joi.string().min(URL_QUERY_STR_MIN).max(URL_QUERY_STR_MAX).required(),
        }),
      },
    },
  },
];
