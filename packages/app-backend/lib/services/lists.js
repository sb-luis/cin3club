import Schmervice from '@hapipal/schmervice';

export default class ListService extends Schmervice.Service {
  async getAllLists({ creatorId, sortOrder = 'desc', sortType = 'title' }) {
    this.server.log(['info', 'list-service'], `READ user lists`);
    console.log('Getting lists!');

    const { MediaItemList, MediaItem } = this.server.app.models;

    // Fetch data from DB
    let lists = await MediaItemList.findAll({
      where: {
        creatorId,
      },
      order: [[sortType, sortOrder]],
      include: {
        model: MediaItem,
        as: 'mediaItems',
        attributes: ['id'],
      },
      attributes: ['id', 'title', 'description'],
    });

    return { lists };
  }


  async getOneList({ id, creatorId, lang = 'en' }) {
    this.server.log(['info', 'list-service'], `READ user lists`);
    console.log('Getting lists!');
    console.log(lang);

    const { MediaItemList, MediaItem, MediaItemLang } = this.server.app.models;

    const offset = parseInt(page - 1) * 10;

    // Fetch data from DB
    let list = await MediaItemList.findOne({
      where: {
        id,
        creatorId,
      },
      attributes: ['id', 'title', 'description'],
      include: {
        model: MediaItem,
        as: 'mediaItems',
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

    list.mediaItems = list.mediaItems.map((mediaItem) => ({
        mediaType: mediaItem.mediaType,
        tmdbId: mediaItem.tmdbId,
        imdbId: mediaItem.imdbId,
        originalTitle: mediaItem.originalTitle,
        releaseYear: mediaItem.releaseYear,
        title: mediaItem.mediaItemLangs[0].title,
        posterPath: mediaItem.mediaItemLangs[0].posterPath,
        overview: mediaItem.mediaItemLangs[0].overview,
    }));

    console.log('List fetched');
    console.log(list);

    return { list };
  }

  async createOneList({ creatorId, title, description = '', mediaItems = [] }) {
    this.server.log(
      ['info', 'rating-service'],
      `CREATE list with title:${title} and description:${description}`,
    );

    console.log('creating list!');

    const { MediaItemList } = this.server.app.models;
    const { connection } = this.server.app;
    // Start transaction...
    const transaction = await connection.transaction();

    try {
      // Create list 
      const listData = {
        mediaItems, // FK
        title,
        description,
        creatorId, // FK
      };

      console.log('List data');
      console.log(listData);

      const list = await MediaItemList.create(listData, { transaction });

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

  async updateOneList({ id, creatorId, title, description, mediaItems }) {
    this.server.log(['info', 'rating-service'], `UPDATE list ${id} with title:${title}, description:${description} and media items:${mediaItems}`);

    const { MediaItemList } = this.server.app.models;

    // Get existing rating
    let list = await MediaItemList.findOne({
      where: {
        id,
        creatorId,
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

  async deleteOneList({ id, creatorId}) {
    this.server.log(['info', 'rating-service'], `DELETE list with ${id}`);
    const { MediaItemList } = this.server.app.models;

    // Delete rating
    const list = await MediaItemList.destroy({
      where: {
        id,
        creatorId,
      },
    });

    return list;
  }
}
