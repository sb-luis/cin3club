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
      request.log('debug', 'Fetching movies from thrid-party API...');
      const { s } = request.query;

      try {
        const res = await axios.get(`http://www.omdbapi.com/?s=${s}&page=1&apikey=${process.env.MOVIE_API_KEY}`);
        return res.data.Search;
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

      try {
        // GET movie details
        request.log('info', `Querying movie details for imdbID "${id}"`);
        const res = await axios.get(`http://www.omdbapi.com/?i=${id}&apikey=${process.env.MOVIE_API_KEY}`);
        return res.data;
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
