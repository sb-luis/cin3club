export default {
  name: 'test-plugin',
  version: '0.0.0.',
  async register(server /* options */) {
    server.plugins.sql = { test: 'blah' };
  },
};
