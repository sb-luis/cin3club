// ESM doesn't support JSON imports
import Joi from 'joi';
import Boom from '@hapi/boom';
import { URL_QUERY_STR_MIN, URL_QUERY_STR_MAX } from '../constants.js';

// --- PROTECTED USER RATINGS ENDPOINTS ---

export default [
  // GET all user ratings
  {
    method: 'GET',
    path: '/api/ratings',
    handler: async (request, h) => {
      console.log('GET ALL RTINGS');
      const { ratingService } = request.services();
      const userId = request.auth.credentials.userId;
      try {
        const ratings = await ratingService.getAllRatings({ userId });
        return ratings;
      } catch (err) {
        return Boom.boomify(err);
      }
    },
  },
  // GET user ratings for one movie
  {
    method: 'GET',
    path: '/api/ratings/{movieId}',
    handler: async (request, h) => {
      console.log('GET SOME RATINGS');
      const { ratingService } = request.services();
      const userId = request.auth.credentials.userId;
      const { movieId } = request.params;
      try {
        const ratings = await ratingService.getMovieRatings({ userId, movieId });
        return ratings;
      } catch (err) {
        return Boom.boomify(err);
      }
    },
    options: {
      validate: {
        params: Joi.object({
          movieId: Joi.number(),
        }),
      },
    },
  },
  // CREATE user rating - private
  {
    method: 'POST',
    path: '/api/ratings',
    handler: async (request, h) => {
      console.log('CREATE RATING');
      try {
        const { ratingService } = request.services();
        const userId = request.auth.credentials.userId;
        const { movie, score, dateSeen } = request.payload;
        const rating = await ratingService.createRating({ userId, movie, score, dateSeen });
        return rating;
      } catch (err) {
        return Boom.boomify(err);
      }
    },
    options: {
      validate: {
        payload: Joi.object({
          movie: Joi.object({
            englishTitle: Joi.string(),
            originalTitle: Joi.string(),
            releaseDate: Joi.string(),
            posterPath: Joi.string(),
            directors: Joi.array().items(Joi.string()),
            tmdbId: Joi.number(),
            imdbId: Joi.string(),
            genres: Joi.array().items(Joi.string()), // Max 50
            productionCountries: Joi.array().items(Joi.string()), // Max 50
            budget: Joi.number(),
            revenue: Joi.number(),
            runningTime: Joi.number(),
          }),
          score: Joi.number(),
          dateSeen: Joi.string(),
        }),
      },
    },
  },
  // UPDATE user rating - private
  {
    method: 'PUT',
    path: '/api/ratings/{id}',
    handler: async (request, h) => {
      console.log('UPDATE RATING');
      const { ratingService } = request.services();
      const userId = request.auth.credentials.userId;
      const { id } = request.params;
      const { score, dateSeen } = request.payload;
      try {
        const rating = await ratingService.updateRating({ id, userId, score, dateSeen });
        return rating;
      } catch (err) {
        return Boom.boomify(err);
      }
    },
    options: {
      validate: {
        payload: Joi.object({
          score: Joi.number(),
          dateSeen: Joi.string(),
        }),
        params: Joi.object({
          id: Joi.number(),
        }),
      },
    },
  },
  // DELETE USER RATINGS - private
  {
    method: 'DELETE',
    path: '/api/ratings/{id}',
    handler: async (request, h) => {
      console.log('DELETE RATING');
      const { ratingService } = request.services();
      const userId = request.auth.credentials.userId;
      const { id } = request.params;
      const { score, dateSeen } = request.payload;
      try {
        const rating = await ratingService.deleteRating({ userId, id });
        return rating;
      } catch (err) {
        return Boom.boomify(err);
      }
    },
    options: {
      validate: {
        params: Joi.object({
          id: Joi.number(),
        }),
      },
    },
  },
];
