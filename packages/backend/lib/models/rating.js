import { DataTypes } from 'sequelize';

export default {
  name: 'Rating',
  schema: {
    // userId - FOREIGN KEY
    // movieId - FOREIGN KEY (i.e. tmdbId)
    dateSeen: DataTypes.DATE,
    score: DataTypes.INTEGER,
  },
};
