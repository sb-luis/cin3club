import Schmervice from '@hapipal/schmervice';

export default class RatingService extends Schmervice.Service {
  async getAllRatings({ userId, page = 1, sort = 'DESC' }) {
    this.server.log(['info', 'rating-service'], `READ user ratings`);

    const { Rating, Movie } = this.server.app.models;

    const offset = parseInt(page - 1) * 10;

    // Fetch data from DB
    const ratings = await Rating.findAll({
      where: {
        userId,
      },
      attributes: ['id', 'dateSeen', 'score'],
      include: {
        model: Movie,
        as: 'movie',
        attributes: ['id', 'englishTitle', 'originalTitle', 'releaseDate', 'posterPath'],
      },
      offset: offset,
      limit: 10,
      order: [['dateSeen', sort]],
    });

    const total = await Rating.count({
      where: {
        userId,
      },
    });

    return { ratings, total };
  }

  async getMovieRatings({ userId, movieId }) {
    this.server.log(['info', 'rating-service'], `READ user ratings for movie '${movieId}'`);

    const { Rating } = this.server.app.models;

    // Fetch data from DB
    const ratings = await Rating.findAll({
      where: {
        userId,
        movieId,
      },
      attributes: ['id', 'dateSeen', 'score'],
      order: [['dateSeen', 'DESC']],
    });

    return ratings;
  }

  async createRating({ userId, movie, score, dateSeen }) {
    this.server.log(
      ['info', 'rating-service'],
      `CREATE rating for movie ${movie.tmdbId}, with score:${score} and dateSeen:${dateSeen}`,
    );

    const { Rating, Movie } = this.server.app.models;
    const { connection } = this.server.app;
    // Start transaction...
    const transaction = await connection.transaction();

    try {
      // Look for movie in DB
      let existingMovie = await Movie.findOne({
        where: {
          id: movie.tmdbId,
        },
      });

      if (!existingMovie) {
        // If movie doesn't exists, create a record for it
        existingMovie = await Movie.create(
          {
            // lister
            id: movie.tmdbId,
            englishTitle: movie.englishTitle,
            originalTitle: movie.originalTitle,
            releaseDate: movie.releaseDate,
            posterPath: movie.posterPath,
            // extra
            directors: movie.directors,
            imdbId: movie.imdbId,
            genres: movie.genres,
            productionCountries: movie.productionCountries,
            budget: movie.budget,
            revenue: movie.revenue,
            runningTime: movie.runningTime,
          },
          { transaction },
        );
      }

      // Create rating
      const date = new Date(dateSeen);
      const rating = await Rating.create(
        {
          userId,
          movieId: existingMovie.id,
          score,
          dateSeen: date,
        },
        { transaction },
      );

      // If transaction went well...
      transaction.commit();

      return rating.toJSON();
    } catch (err) {
      // If transaction went wrong...
      transaction.rollback();
      throw new Error(err);
    }
  }

  async updateRating({ id, userId, score, dateSeen }) {
    this.server.log(['info', 'rating-service'], `UPDATE rating ${id} with score:${score} and dateSeen:${dateSeen}`);

    const { Rating } = this.server.app.models;

    // Get existing rating
    let rating = await Rating.findOne({
      where: {
        id,
        userId,
      },
    });

    // A rating must exists in order to be updated
    if (!rating) throw new Error();

    const date = new Date(dateSeen);

    // Update data
    rating.score = score;
    rating.dateSeen = date;

    // Save new data
    await rating.save();

    return rating.toJSON();
  }

  async deleteRating({ id, userId }) {
    this.server.log(['info', 'rating-service'], `DELETE rating with ${id}`);
    const { Rating } = this.server.app.models;

    // Delete rating
    const rating = await Rating.destroy({
      where: {
        id,
        userId,
      },
    });

    return rating;
  }
}
