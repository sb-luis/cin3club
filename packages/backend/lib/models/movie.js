import { DataTypes } from 'sequelize';

/* 
  Only storing essential fields for 
    - Movie lists (Ratings / CustomLists) 
    - JSON exports (Ratings / CustomLists)
*/

export default {
  name: 'Movie',
  schema: {
    // The basics
    englishTitle: DataTypes.STRING,
    originalTitle: DataTypes.STRING,
    releaseDate: DataTypes.STRING,
    posterPath: DataTypes.STRING,
    directors: DataTypes.ARRAY(DataTypes.STRING), // Max 50
    imdbId: DataTypes.STRING,
    // Useful for stats
    genres: DataTypes.ARRAY(DataTypes.STRING), // Max 50
    productionCountries: DataTypes.ARRAY(DataTypes.STRING), // Max 50
    budget: DataTypes.INTEGER,
    revenue: DataTypes.INTEGER,
    runningTime: DataTypes.INTEGER,
  },
};

/* EXTRA FIELDS (lazy load from tmdb API instead) 

- Movie Details 

- Movie Credits
    music: DataTypes.ARRAY(DataTypes.STRING), // Max 5
    screenwriting: DataTypes.ARRAY(DataTypes.STRING), // Max 5
    cinematography: DataTypes.ARRAY(DataTypes.STRING), // Max 5
    cast: DataTypes.ARRAY(DataTypes.STRING), // Max 5
    production: DataTypes.ARRAY(DataTypes.STRING), // Max 5
*/
