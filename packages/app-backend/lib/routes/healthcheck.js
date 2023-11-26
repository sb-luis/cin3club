// --- PUBLIC HEALTHCHECK ENDPOINT ---

export default {
  method: 'get',
  path: '/healthcheck',
  options: {
    handler(request, h) {
      request.log('info', 'healthcheck heartbeat');
      return h.response('OK').code(200);
    },
    auth: false,
  },
};