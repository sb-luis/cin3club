'use strict';

import HauteCouture from '@hapipal/haute-couture';
import { Sequelize } from 'sequelize';

// ESM doesn't support JSON imports
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('../package.json');

export const plugin = {
  pkg,
  register: async (server, options) => {
    console.log('Connecting to PostgreSQL...');
    const sequelize = (server.app.connection = new Sequelize(process.env.DATABASE_URL));
    await sequelize.authenticate();
    console.log('Connection to PostgreSQL established!');

    // Compose Haute Couture project
    console.log('Composing Hapi server with HauteCouture...');
    await HauteCouture.compose(server, options);

    // Sync database after all models have been created by Haute Couture
    await server.app.connection.sync();
    console.log('All Sequelize models synchronized successfully!');
  },
};
