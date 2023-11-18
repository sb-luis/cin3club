import { DataTypes } from 'sequelize';

export default {
  name: 'Rating',
  schema: {
    userId: DataTypes.INTEGER,
    movieId: DataTypes.INTEGER,
    dateSeen: DataTypes.DATE,
    rating: DataTypes.INTEGER,
  },
};
