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
      const { listService } = request.services();
      const creatorId = request.auth.credentials.userId;
      try {
        const lists = await listService.getAllLists({ creatorId });
        return lists;
      } catch (err) {
        return Boom.boomify(err);
      }
    },
  },

  // CREATE list - private
  {
    method: 'POST',
    path: '/api/lists',
    handler: async (request, h) => {
      try {
        console.log('creating user list');
        const { listService } = request.services();
        const creatorId = request.auth.credentials.userId;
        const { title, description } = request.payload;
        const list = await listService.createOneList({ creatorId, title, description });
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
      const { listService } = request.services();
      const creatorId = request.auth.credentials.userId;
      const { id } = request.params;
      const { title, description, mediaItems } = request.payload;
      try {
        const list = await listService.updateOneList({ id, creatorId, title, description, mediaItems });
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
          mediaItems: Joi.array().items(Joi.number()),
        }),
        params: Joi.object({
          id: Joi.number(),
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
      const { listService } = request.services();
      const creatorId = request.auth.credentials.userId;
      const { id } = request.params;
      try {
        const list = await listService.deleteOneList({ creatorId, id });
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
