'use strict';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

import Glue from '@hapi/glue';
import Exiting from 'exiting';
import Manifest from './manifest.js';

// Compute __dirname as ESM doesn't expose it
const __dirname = dirname(fileURLToPath(import.meta.url));

export const deployment = async ({ start } = {}) => {
  const manifest = Manifest.get('/', process.env);
  const server = await Glue.compose(manifest, { relativeTo: __dirname });

  if (start) {
    await Exiting.createManager(server).start();
    server.log(['start'], `Server started at ${server.info.uri}`);
    return server;
  }

  await server.initialize();

  return server;
};

export default deployment({ start: true });

process.on('unhandledRejection', (err) => {
  throw err;
});
