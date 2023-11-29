import { DataTypes } from 'sequelize';

export default {
  name: 'ProfileStats',
  schema: {
    // userId - FOREIGN KEY
    averageScore: DataTypes.INTEGER,
    maxScore: DataTypes.INTEGER,
    minScore: DataTypes.INTEGER,
    moviesCount: DataTypes.INTEGER,
    ratingsCount: DataTypes.INTEGER,
    ratingsStats: DataTypes.JSON,
    /*
      {
        // Short lists (Max 5)

        bestRatedMovies: { 'Blue Velvet': 100...} 
        worstRatedMovies: { 'Superhero Movie': 1...} 
        mostSeenMovies: { 'Match Point': 10 ...} 

        bestRatedTvShows: { 'Twin Peaks': 100...} 
        worstRatedTvShows: { 'Breaking Bad': 20...} 
        mostSeenTvShows: { 'Twin Peaks': 4 ...} 

        bestRatedDirectors: { 'David Lynch': 93...} 
        worstRatedDirectors: { 'Alejandro Jodorowsky': 2...} 
        mostSeenDirectors: { 'Woody Allen': 17 ...} 

        mostSeenActors: { 'Scarlett Johansson': 8, 'Joaquin Phoenix': 6 ...}

        // Big Lists 

          - exc. multiple ratings 

        moviesAndTvShowsByCountry: { 'GB': 128, 'US': 580, 'JP': 20 ...}
        moviesAndTvShowsByYear: { 1970: 8, 1971: 2, 1976: 1 ... }
        moviesAndTvShowsByGenre: { 1: 28, 9901: 30, 888: 3 ... }

          - inc. multiple ratings 

        ratingsByScore: { 1: 20, 25: 2, 100: 5 ... }
        ratingsByDateSeen: { 2022: [12, 15...], 2023: [13,16...] ...}

        // Fun ones 

        ratingsByDateSeen: { 2022: [65, 55...], 2023: [65, 66...] ...}
      }
    */
  },
};

/*

Aggregated stats for homepage:

- Latest seen movies (what people watched recently)
- Best rated movies (what people like more)

*/
