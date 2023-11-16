'use strict';

import Confidence from '@hapipal/confidence';
import Toys from '@hapipal/toys';

// Glue manifest as a confidence store
export default new Confidence.Store({
  server: {
    host: '0.0.0.0',
    port: {
      $param: 'PORT',
      $coerce: 'number',
      $default: 3000,
    },
    routes: {
      cors: {
        // an array of origins or '*' or 'ignore'
        origin: [process.env.CLIENT_URL],
        // boolean - 'Access-Control-Allow-Credentials'
        credentials: true,
      },
    },
    debug: {
      $filter: 'NODE_ENV',
      $default: {
        log: ['error', 'start'],
        request: ['error'],
      },
      production: {
        request: ['implementation'],
      },
    },
  },
  register: {
    plugins: [
      {
        plugin: '../lib', // Main plugin
        options: {},
      },
      {
        $filter: 'NODE_ENV',
        $default: 'blipp',
        production: Toys.noop,
      },
      {
        plugin: {
          $filter: 'NODE_ENV',
          $default: '@hapipal/hpal-debug',
          production: Toys.noop,
        },
      },
    ],
  },
});
