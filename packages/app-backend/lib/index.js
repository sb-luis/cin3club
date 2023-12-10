'use strict';

import { Sequelize } from 'sequelize';
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

    const extraOptions = process.env.NODE_ENV === 'production' ? prodLogOptions : devLogOptions;

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

    /* --- DATABASE---
     */
    server.log('info', 'Connecting to PostgreSQL...');
    const sequelize = (server.app.connection = new Sequelize(process.env.DATABASE_URL, {
      logging: (msg) => server.log('debug', msg),
    }));
    await sequelize.authenticate();
    server.log('info', 'Connection to PostgreSQL established!');

    /* --- COMPOSE HAUTE COUTURE PROJECT ---
     */
    server.log('info', 'Composing Hapi server with HauteCouture...');
    await HauteCouture.compose(server, options);

    // Set up Sequelize associations
    // After all models have been created by Haute Couture
    // https://sequelize.org/docs/v6/core-concepts/assocs/
    const { User, Session, Rating, MediaItem, MediaItemLang } = server.app.models;
    // Add `userId` foreign key in Session and Rating
    Session.belongsTo(User, { as: 'user', foreignKey: 'userId' });
    Rating.belongsTo(User, { as: 'user', foreignKey: 'userId' });

    // Add `mediaItemId` foreign key in Rating
    Rating.belongsTo(MediaItem, { as: 'mediaItem', foreignKey: 'mediaItemId' });

    // Add `mediaItemLangId` foreign key in MediaItem
    MediaItem.hasMany(MediaItemLang, { as: 'mediaItemLangs', foreignKey: 'mediaItemId' });
    MediaItemLang.belongsTo(MediaItem, { foreignKey: 'mediaItemId' });

    // Sync database
    await server.app.connection.sync();
    server.log('info', 'All Sequelize models synchronized successfully!');

    server.auth.default('session');
  },
};
