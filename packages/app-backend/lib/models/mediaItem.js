import { DataTypes } from 'sequelize';

export default {
  name: 'MediaItem',
  schema: {
    mediaType: DataTypes.STRING, // movie or tv
    tmdbId: DataTypes.INTEGER,
    imdbId: DataTypes.STRING,
    originalTitle: DataTypes.STRING,
    releaseYear: DataTypes.INTEGER,
  },
};
