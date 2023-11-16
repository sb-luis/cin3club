import os from 'os';

export default [
  // GET
  {
    method: 'GET',
    path: '/api/requests',
    handler: async (request, h) => {
      const { Request } = request.server.app.models;
      const items = await Request.findAll();
      return JSON.stringify(items, null, 2);
    },
  },
  // POST
  {
    method: 'POST',
    path: '/api/requests',
    handler: async (request, h) => {
      const { Request } = request.server.app.models;
      const xFF = request.headers['x-forwarded-for'];
      const clientIp = xFF ? xFF.split(',')[0] : request.info.remoteAddress;
      const serverHost = os.hostname();
      const path = request.path;
      const date = new Date();

      const item = await Request.create({ clientIp, serverHost, path });
      return item.toJSON();
    },
  },
  // DELETE
  {
    method: 'DELETE',
    path: '/api/requests',
    handler: async (request, h) => {
      const { Request } = request.server.app.models;

      // Truncate the Request table
      await Request.destroy({
        truncate: true,
      });

      return [];
    },
  },
];
