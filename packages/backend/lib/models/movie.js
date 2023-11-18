import { DataTypes } from 'sequelize';

export default {
  name: 'Movie',
  schema: {
    englishTitle: DataTypes.STRING,
    originalTitle: DataTypes.STRING,
    releaseDate: DataTypes.INTEGER,
    posterPath: DataTypes.STRING,
    runningTime: DataTypes.INTEGER,
    budget: DataTypes.INTEGER,
    revenue: DataTypes.INTEGER,
    genres: DataTypes.ARRAY(DataTypes.STRING), // Max 50
    productionCountries: DataTypes.ARRAY(DataTypes.STRING), // Max 50
    // --- CREDITS---
    direction: DataTypes.ARRAY(DataTypes.STRING), // Max 50
    music: DataTypes.ARRAY(DataTypes.STRING), // Max 5
    screenwriting: DataTypes.ARRAY(DataTypes.STRING), // Max 5
    cinematography: DataTypes.ARRAY(DataTypes.STRING), // Max 5
    cast: DataTypes.ARRAY(DataTypes.STRING), // Max 5
    production: DataTypes.ARRAY(DataTypes.STRING), // Max 5
    // IDs
    tmdbId: DataTypes.INTEGER,
    imdbId: DataTypes.STRING,
  },
};
