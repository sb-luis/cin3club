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
        $filter: 'NODE_ENV',
        $default: {
          // 'Access-Control-Allow-Credentials'
          credentials: true,
          // an array of origins or '*' or 'ignore'
          origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL_DEV],
        },
        production: {
          credentials: true,
          origin: [process.env.FRONTEND_URL],
        },
      },
    },
    debug: {
      $filter: 'NODE_ENV',
      $default: {},
      production: {
        log: ['error', 'start'],
        request: ['error', 'implementation'],
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
