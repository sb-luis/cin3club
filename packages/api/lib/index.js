'use strict';

import HauteCouture from '@hapipal/haute-couture';

// ESM doesn't support JSON imports
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('../package.json');

export const plugin = {
  pkg,
  register: async (server, options) => {
    // Custom plugin code can go here

    await HauteCouture.compose(server, options);
  },
};
