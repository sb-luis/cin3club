// ESM doesn't support JSON imports
import { URL_QUERY_STR_MAX } from '../../server/constants.js';
import Joi from 'joi';
import Boom from '@hapi/boom';

// --- PROTECTED USER LIST ENDPOINTS ---

export default [
  // GET all user lists - private
  {
    method: 'GET',
    path: '/api/lists',
    handler: async (request, h) => {
      console.log('getting user lists!');
      const { mediaItemListsService } = request.services();
      const creatorId = request.auth.credentials.userId;
      try {
        const lists = await mediaItemListsService.getAllLists({ creatorId });
        return lists;
      } catch (err) {
        return Boom.boomify(err);
      }
    },
  },
  // GET one user lists - private
  {
    method: 'GET',
    path: '/api/lists/{id}',
    handler: async (request, h) => {
      console.log('getting one user list!');
      const { mediaItemListsService } = request.services();
      const { lang } = request.query;
      const { id } = request.params;
      const creatorId = request.auth.credentials.userId;
      try {
        const list = await mediaItemListsService.getOneList({ creatorId, id, lang });
        return list;
      } catch (err) {
        return Boom.boomify(err);
      }
    },
    options: {
      validate: {
        query: Joi.object({
          lang: Joi.string().max(URL_QUERY_STR_MAX).default('en'),
        }),
        params: Joi.object({
          id: Joi.number(),
        }),
      },
    },
  },

  // CREATE list - private
  {
    method: 'POST',
    path: '/api/lists',
    handler: async (request, h) => {
      try {
        console.log('creating user list');
        const { mediaItemListsService } = request.services();
        const creatorId = request.auth.credentials.userId;
        const { title, description } = request.payload;
        const list = await mediaItemListsService.createOneList({ creatorId, title, description });
        return list;
      } catch (err) {
        return Boom.boomify(err);
      }
    },
    options: {
      validate: {
        payload: Joi.object({
          title: Joi.string(),
          description: Joi.string(),
        }),
      },
    },
  },

  // UPDATE user list - private
  {
    method: 'PUT',
    path: '/api/lists/{id}',
    handler: async (request, h) => {
      console.log('updating user list!');
      const { mediaItemListsService } = request.services();
      const creatorId = request.auth.credentials.userId;
      const { id } = request.params;
      const { title, description } = request.payload;
      try {
        const list = await mediaItemListsService.updateOneList({ id, creatorId, title, description });
        return list;
      } catch (err) {
        return Boom.boomify(err);
      }
    },
    options: {
      validate: {
        payload: Joi.object({
          title: Joi.string().required(),
          description: Joi.string(),
        }).unknown(true),
        params: Joi.object({
          id: Joi.number(),
        }),
      },
    },
  },

  // UPDATE user lists order - private
  {
    method: 'PUT',
    path: '/api/lists',
    handler: async (request, h) => {
      console.log('updating user lists order!');
      const { mediaItemListsService } = request.services();
      const creatorId = request.auth.credentials.userId;
      const { lists } = request.payload;
      try {
        const result = await mediaItemListsService.updateListOrder({ lists, creatorId });
        return result;
      } catch (err) {
        return Boom.boomify(err);
      }
    },
    options: {
      validate: {
        payload: Joi.object({
          lists: Joi.array().items(
            Joi.object({
              id: Joi.number(),
              order: Joi.number(),
            }).unknown(true),
          ),
        }),
      },
    },
  },

  // DELETE user list - private
  {
    method: 'DELETE',
    path: '/api/lists/{id}',
    handler: async (request, h) => {
      console.log('deleting user list!');
      const { mediaItemListsService } = request.services();
      const creatorId = request.auth.credentials.userId;
      const { id } = request.params;
      try {
        const list = await mediaItemListsService.deleteOneList({ creatorId, id });
        return list;
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
