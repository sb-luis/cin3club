import { DataTypes } from 'sequelize';

export default {
  name: 'MemberProfile',
  schema: {
    // userId - FOREIGN KEY
    data: DataTypes.JSON,
    /*
      {
        averageScore
        averageScoreByDate
        averageScoreByCountry
        maxScore
        minScore

        totalMoviesRated
        totalMoviesRatedByScore
        totalMoviesRatedByMonth
        bestRatedMovies
        worstRatedMovies

        totalMoviesWatched
        mostWatchedMovies
        totalMoviesWatchedByCountry
        totalMoviesWatchedByYear
        totalMoviesWatchedByGenre

        totalTvShowsRated
        totaTvShowsRatedByScore
        totalTvShowsRatedByMonth
        bestRatedTvShows
        worstRatedTvShows

        totalTvShowsWatched
        mostWatchedTvShows
        totalTvShowsWatchedByCountry
        totalTvShowsWatchedByYear
        totalTvShowsWatchedByGenre
      }
    */
  },
};
