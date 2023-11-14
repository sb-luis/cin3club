import { Sequelize, DataTypes } from 'sequelize';

export default {
  name: 'sql',
  version: '0.0.0.',
  async register(server /* options */) {
    console.log('REGISTERING "postgresql-adapter"...');
    // CONNECT TO POSTGRES DB
    console.log('Connecting to Postgres...');
    const connectionStr = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;
    console.log(`connection string: "${connectionStr}"`);

    const sequelize = new Sequelize(connectionStr);

    try {
      console.log('Authenticating...');
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }

    // CREATE MODELS
    console.error('Creating Request model...');
    const Request = sequelize.define('request', {
      clientIp: DataTypes.STRING,
      serverHost: DataTypes.STRING,
      path: DataTypes.STRING,
      time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    // SYNC MODELS
    console.error('Syncing models...');
    await sequelize.sync();
    console.log('All models were synchronized successfully.');

    // MAKE MODELS accessible from the server app
    server.plugins.sql = { Request };
  },
};
