import { DataTypes } from 'sequelize';

/* 
  Only storing essential fields for 
    - Movie lists (Ratings / CustomLists) 
    - JSON exports (Ratings / CustomLists)
*/

export default {
  name: 'Movie',
  schema: {
    englishTitle: DataTypes.STRING,
    originalTitle: DataTypes.STRING,
    releaseDate: DataTypes.INTEGER,
    posterPath: DataTypes.STRING,
    direction: DataTypes.ARRAY(DataTypes.STRING), // Max 50
    // IDs
    tmdbId: DataTypes.INTEGER,
    imdbId: DataTypes.STRING,
  },
};

/* EXTRA FIELDS (lazy load from tmdb API instead) 

- Movie Details 
    runningTime: DataTypes.INTEGER,
    budget: DataTypes.INTEGER,
    revenue: DataTypes.INTEGER,
    genres: DataTypes.ARRAY(DataTypes.STRING), // Max 50
    productionCountries: DataTypes.ARRAY(DataTypes.STRING), // Max 50

- Movie Credits
    music: DataTypes.ARRAY(DataTypes.STRING), // Max 5
    screenwriting: DataTypes.ARRAY(DataTypes.STRING), // Max 5
    cinematography: DataTypes.ARRAY(DataTypes.STRING), // Max 5
    cast: DataTypes.ARRAY(DataTypes.STRING), // Max 5
    production: DataTypes.ARRAY(DataTypes.STRING), // Max 5
*/
