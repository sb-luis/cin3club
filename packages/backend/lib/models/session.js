import { DataTypes } from 'sequelize';

export default {
  name: 'Session',
  schema: {
    userId: DataTypes.INTEGER,
    expires: DataTypes.DATE,
  },
};
