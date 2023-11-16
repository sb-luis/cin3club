// ESM doesn't support JSON imports
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const movies = require('../movies.json');

export default {
  method: 'get',
  path: '/api/movies',
  options: {
    handler(request, h) {
      console.log('Proceeding to protected route');
      return movies;
    },
    auth: 'session',
  },
};
