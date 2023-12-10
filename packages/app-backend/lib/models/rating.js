import { DataTypes } from 'sequelize';

export default {
  name: 'Rating',
  schema: {
    // userId - FOREIGN KEY
    // mediaItemId - FOREIGN KEY (i.e. tmdbId)
    mediaType: DataTypes.STRING,
    tmdbId: DataTypes.INTEGER,
    dateSeen: DataTypes.DATE,
    score: DataTypes.INTEGER,
  },
};
