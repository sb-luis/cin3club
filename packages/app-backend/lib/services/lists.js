import Schmervice from '@hapipal/schmervice';

export default class ListService extends Schmervice.Service {
  async getAllLists({ userId, sortOrder = 'desc', sortType = 'title' }) {
    this.server.log(['info', 'list-service'], `READ user lists`);
    console.log('Getting lists!');
    console.log(lang);

    const { MediaList, MediaItem, MediaItemLang } = this.server.app.models;

    const offset = parseInt(page - 1) * 10;

    // Fetch data from DB
    let lists = await MediaList.findAll({
      where: {
        userId,
      },
      attributes: ['id', 'title', 'description', 'mediaItems'],
      order: [[sortType, sortOrder]]
    });

    return { lists };
  }


  async getOneList({ id, userId, lang = 'en' }) {
    this.server.log(['info', 'list-service'], `READ user lists`);
    console.log('Getting lists!');
    console.log(lang);

    const { MediaList, MediaItem, MediaItemLang } = this.server.app.models;

    const offset = parseInt(page - 1) * 10;

    // Fetch data from DB
    let list = await MediaList.findOne({
      where: {
        id,
        userId,
      },
      attributes: ['id', 'title', 'description'],
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
    });

    list.mediaItem = list.mediaItem.map((mediaItem) => ({
      mediaItem: {
        mediaType: mediaItem.mediaType,
        tmdbId: mediaItem.tmdbId,
        imdbId: mediaItem.imdbId,
        originalTitle: mediaItem.originalTitle,
        releaseYear: mediaItem.releaseYear,
        title: mediaItem.mediaItemLangs[0].title,
        posterPath: mediaItem.mediaItemLangs[0].posterPath,
        overview: mediaItem.mediaItemLangs[0].overview,
      },
    }));

    console.log('List fetched');
    console.log(list);

    return { list };
  }

  async createOneList({ userId, title, description = '', mediaItems = [] }) {
    this.server.log(
      ['info', 'rating-service'],
      `CREATE list with title:${title} and description:${description}`,
    );

    console.log('creating list!');

    const { MediaList } = this.server.app.models;
    const { connection } = this.server.app;
    // Start transaction...
    const transaction = await connection.transaction();

    try {
      // Create list 
      const date = new Date(dateSeen);

      const listData = {
        mediaItems, // FK
        title,
        description,
        userId, // FK
      };

      console.log('List data');
      console.log(listData);

      const list = await MediaList.create(listData, { transaction });

      // If transaction went well...
      transaction.commit();

      console.log('List created successfully!');
      return list.toJSON();
    } catch (err) {
      // If transaction went wrong...
      transaction.rollback();
      throw new Error(err);
    }
  }

  async updateOneList({ id, userId, title, desciption, mediaItems }) {
    this.server.log(['info', 'rating-service'], `UPDATE list ${id} with title:${title}, description:${description} and media items:${mediaItems}`);

    const { MediaList } = this.server.app.models;

    // Get existing rating
    let list = await MediaList.findOne({
      where: {
        id,
        userId,
      },
    });

    // A rating must exists in order to be updated
    if (!list) throw new Error();

    // Update data
    list.title = title;
    list.description = description;
    list.mediaItems = mediaItems;

    // Save new data
    await list.save();

    return list.toJSON();
  }

  async deleteOneList({ id, userId }) {
    this.server.log(['info', 'rating-service'], `DELETE list with ${id}`);
    const { MediaList } = this.server.app.models;

    // Delete rating
    const list = await MediaList.destroy({
      where: {
        id,
        userId,
      },
    });

    return list;
  }
}
