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
      const { s, lang } = request.query;
      const { tmdbApi } = request.services();
      try {
        const movies = await tmdbApi.getMovies({ s, lang });
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
          lang: Joi.string().min(URL_QUERY_STR_MIN).max(URL_QUERY_STR_MAX).required(),
        }).options({ stripUnknown: true }),
      },
    },
  },
  // MOVIE DETAILS
  {
    method: 'GET',
    path: '/api/movies/{id}',
    handler: async (request, h) => {
      console.log('fetching movie details!');

      const { id } = request.params;
      const { lang } = request.query;
      const { tmdbApi } = request.services();

      console.log(`Passing ID ${id}`);
      console.log(`Passing lang '${lang}'`);

      try {
        const movieDetails = await tmdbApi.getMovieDetails({ id, lang });
        return movieDetails;
      } catch (err) {
        request.log('err', err);
      }
    },
    options: {
      validate: {
        query: Joi.object({
          lang: Joi.string().min(URL_QUERY_STR_MIN).max(URL_QUERY_STR_MAX).required(),
        }).options({ stripUnknown: true }),
        params: Joi.object({
          id: Joi.string().min(URL_QUERY_STR_MIN).max(URL_QUERY_STR_MAX).required(),
        }).options({ stripUnknown: true }),
      },
    },
  },
  // POST
];
