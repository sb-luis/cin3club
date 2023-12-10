import { DataTypes } from 'sequelize';

export default {
  name: 'AppStats',
  schema: {
    data: DataTypes.JSON,
    /*
      {
        latestMoviesWatched
        bestRatedMovies 
        latestTvShowsWatched
        bestRatedTvShows
      }
    */
  },
};
