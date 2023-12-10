// ESM doesn't support JSON imports
import { URL_QUERY_STR_MAX } from '../../server/constants.js';
import Joi from 'joi';
import Boom from '@hapi/boom';

// --- PROTECTED USER RATINGS ENDPOINTS ---

export default [
  // GET all user ratings
  {
    method: 'GET',
    path: '/api/ratings',
    handler: async (request, h) => {
      const { ratingService } = request.services();
      const { lang, page, sortOrder, sortType, tmdbId, mediaType } = request.query;
      const userId = request.auth.credentials.userId;

      try {
        let ratings = [];
        if (!tmdbId) {
          console.log(`Getting all user ratings with locale = '${lang}'`);
          // GET all user ratings
          ratings = await ratingService.getAllRatings({ userId, page, sortOrder, sortType, limit: 10, lang });
        } else {
          console.log('Getting mediaItem user ratings');
          // GET mediaItem user ratings
          ratings = await ratingService.getMediaItemRatings({
            userId,
            tmdbId,
            mediaType,
            sortOrder,
            sortType,
            limit: 50,
          });
        }
        return ratings;
      } catch (err) {
        return Boom.boomify(err);
      }
    },
    options: {
      validate: {
        query: Joi.object({
          lang: Joi.string().max(URL_QUERY_STR_MAX).default('en'),
          page: Joi.number().default(1),
          sortType: Joi.string().default('dateSeen'),
          sortOrder: Joi.string().default('desc'),
          tmdbId: Joi.number().default(null),
          mediaType: Joi.string().default(''),
        }),
      },
    },
  },
  // CREATE user rating - private
  {
    method: 'POST',
    path: '/api/ratings',
    handler: async (request, h) => {
      try {
        console.log('craeting user rating');
        const { ratingService } = request.services();
        const userId = request.auth.credentials.userId;
        const { mediaItem, score, dateSeen } = request.payload;
        const rating = await ratingService.createRating({ userId, mediaItem, score, dateSeen });
        return rating;
      } catch (err) {
        return Boom.boomify(err);
      }
    },
    options: {
      validate: {
        payload: Joi.object({
          mediaItem: Joi.object({
            mediaType: Joi.string(),
            tmdbId: Joi.number(),
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
      console.log('getting ratings!');
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
      const { ratingService } = request.services();
      const userId = request.auth.credentials.userId;
      const { id } = request.params;
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
