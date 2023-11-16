import { DataTypes } from 'sequelize';

export default {
  name: 'Request',
  schema: {
    clientIp: DataTypes.STRING,
    serverHost: DataTypes.STRING,
    path: DataTypes.STRING,
    time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
};
