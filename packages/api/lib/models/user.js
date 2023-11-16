import { DataTypes } from 'sequelize';

export default {
  name: 'User',
  schema: {
    alias: DataTypes.STRING,
    password: DataTypes.STRING,
    email: { type: DataTypes.STRING, defaultValue: '' },
  },
};
