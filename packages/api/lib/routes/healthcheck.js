export default {
  method: 'get',
  path: '/healthcheck',
  options: {
    handler(request, h) {
      request.log('info', 'healthcheck heartbeat');
      return h.response('SUCCESS');
    },
  },
};
