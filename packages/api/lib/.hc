'use strict';

// https://github.com/hapipal/haute-couture/blob/main/API.md#amendment-example
module.exports = {
  // Swap-out schwifty's handling of ObjectionORM models for a much simplified handling of Sequelize models.
  models: {
    list: true,
    signature: ['name', 'schema'],
    method: (server, options, name, schema) => {
      console.log(`Defining '${name}' model...`);
      const { connection } = server.app;
      server.app.models = server.app.models || {};
      server.app.models[name] = connection.define(name, schema);
    },
  },
};
