import { DataTypes } from 'sequelize';

export default {
  name: 'User',
  schema: {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: { type: DataTypes.STRING, defaultValue: '' },
  },
};
