'use strict';

import pino from 'hapi-pino';
import HauteCouture from '@hapipal/haute-couture';

// ESM doesn't support JSON imports
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('../package.json');

export const plugin = {
  pkg,
  register: async (server, options) => {
    /* --- LOGGING ---
          trace - more detailed than debug
          debug - diagnostic detailed info
          info - normal behaviour
          warn - unexpected behaviour
          error - severe issues
    */


    /* --- Register Pino Logging ---
     */
    const devLogOptions = {
      redact: {
        paths: ['req', 'tags'],
        remove: true,
      },
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'time,pid,hostname',
        },
      },
    };
    const prodLogOptions = {
      // Redact Authorization headers, see https://getpino.io/#/docs/redaction
      redact: ['req.headers.authorization', 'req.headers.cookie'],
    };
    const extraPinoOptions = process.env.NODE_ENV === 'production' ? prodLogOptions : devLogOptions;
    await server.register({
      plugin: pino,
      options: {
        mergeHapiLogData: true,
        level: process.env.LOG_LEVEL,
        logEvents: ['log', 'request-error'],
        ...extraOptions,
      },
    });
    server.log('info', 'Pino logging registered!');

    /* --- COMPOSE HAUTE COUTURE PROJECT ---
     */
    server.log('info', 'Composing Hapi server with HauteCouture...');
    await HauteCouture.compose(server, options);
  },
};
