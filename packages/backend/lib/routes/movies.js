// ESM doesn't support JSON imports
import axios from 'axios';
import Joi from 'joi';
import { URL_QUERY_STR_MIN, URL_QUERY_STR_MAX } from '../constants.js';

export default [
  // MOVIES LISTER
  {
    method: 'get',
    path: '/api/movies',
    handler: async (request, h) => {
      const { s } = request.query;
      const { tmdbApi } = request.services();
      try {
        const movies = await tmdbApi.getMovies(s);
        return movies;
      } catch (err) {
        request.log('err', err);
      }
    },
    options: {
      auth: 'session',
      validate: {
        query: Joi.object({
          s: Joi.string().min(URL_QUERY_STR_MIN).max(URL_QUERY_STR_MAX).required(),
        }).options({ stripUnknown: true }),
      },
    },
  },
  // MOVIE DETAILS
  {
    method: 'POST',
    path: '/api/movies/{id}',
    handler: async (request, h) => {
      const { id } = request.params;
      const { omdbApi } = request.services();

      try {
        const movieDetails = await omdbApi.getMovieDetails(id);
        return movieDetails;
      } catch (err) {
        request.log('err', err);
      }
    },
    options: {
      validate: {
        params: Joi.object({
          id: Joi.string().min(URL_QUERY_STR_MIN).max(URL_QUERY_STR_MAX).required(),
        }).options({ stripUnknown: true }),
      },
    },
  },
  // POST
];
