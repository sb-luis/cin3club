import Schmervice from '@hapipal/schmervice';

export default class RatingService extends Schmervice.Service {
  async getAllRatings({ userId, page = 1, sortOrder = 'desc', sortType = 'dateSeen', lang = 'en', limit = 10 }) {
    this.server.log(['info', 'rating-service'], `READ user ratings`);
    console.log('Getting ratings!');
    console.log(lang);

    const { Rating, MediaItem, MediaItemLang } = this.server.app.models;

    const offset = parseInt(page - 1) * 10;

    // Fetch data from DB
    let ratings = await Rating.findAll({
      where: {
        userId,
      },
      attributes: ['id', 'dateSeen', 'score'],
      include: {
        model: MediaItem,
        as: 'mediaItem',
        attributes: ['id', 'mediaType', 'tmdbId', 'imdbId', 'originalTitle', 'releaseYear'],
        include: [
          {
            model: MediaItemLang,
            as: 'mediaItemLangs',
            attributes: ['title', 'posterPath', 'overview'],
            where: { lang },
          },
        ],
      },
      offset: offset,
      limit,
      order: [[sortType, sortOrder]],
    });

    ratings = ratings.map((i) => ({
      id: i.id,
      dateSeen: i.dateSeen,
      score: i.score,
      mediaItem: {
        mediaType: i.mediaItem.mediaType,
        tmdbId: i.mediaItem.tmdbId,
        imdbId: i.mediaItem.imdbId,
        originalTitle: i.mediaItem.originalTitle,
        releaseYear: i.mediaItem.releaseYear,
        title: i.mediaItem.mediaItemLangs[0].title,
        posterPath: i.mediaItem.mediaItemLangs[0].posterPath,
        overview: i.mediaItem.mediaItemLangs[0].overview,
      },
    }));

    const total = await Rating.count({
      where: {
        userId,
      },
    });

    console.log('Ratings fetched');
    console.log(ratings);

    return { ratings, total };
  }

  async getMediaItemRatings({ userId, mediaItem }) {
    this.server.log(['info', 'rating-service'], `READ user ratings for media item'${mediaItemId}'`);

    const { Rating } = this.server.app.models;

    // Fetch data from DB
    const ratings = await Rating.findAll({
      where: {
        mediaType: mediaItem.mediaType,
        tmdbId: mediaItem.tmdbId,
        userId,
      },
      attributes: ['id', 'dateSeen', 'score'],
      order: [['dateSeen', 'desc']],
    });

    return ratings;
  }

  async createRating({ userId, mediaItem, score, dateSeen }) {
    this.server.log(
      ['info', 'rating-service'],
      `CREATE rating for movie ${mediaItem.tmdbId}, with score:${score} and dateSeen:${dateSeen}`,
    );

    console.log('creating rating!');
    console.log(mediaItem);

    const { Rating, MediaItem } = this.server.app.models;
    const { connection } = this.server.app;
    // Start transaction...
    const transaction = await connection.transaction();

    try {
      // Look for media item in DB
      let existingItem = await MediaItem.findOne(
        {
          where: {
            tmdbId: mediaItem.tmdbId,
          },
        },
        { transaction },
      );

      if (!existingItem) {
        // If mediaItem doesn't exists, create one
        console.log(`No media item found in internal DB. Fetching from TMDB instead.`);
        const { tmdbService } = this.server.services();
        existingItem = await tmdbService.createMedia({ mediaItem, transaction });
      }

      // Create rating
      const date = new Date(dateSeen);

      const ratingData = {
        userId,
        mediaItemId: existingItem.id,
        score,
        dateSeen: date,
      };

      console.log('Rating data');
      console.log(ratingData);

      const rating = await Rating.create(
        {
          userId,
          mediaItemId: existingItem.id,
          score,
          dateSeen: date,
        },
        { transaction },
      );

      // If transaction went well...
      transaction.commit();

      console.log('Rating created successfully!');
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
