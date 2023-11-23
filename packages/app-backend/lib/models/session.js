import { DataTypes } from 'sequelize';

export default {
  name: 'Session',
  schema: {
    // userId - FOREIGN KEY
    expires: DataTypes.DATE,
  },
};
