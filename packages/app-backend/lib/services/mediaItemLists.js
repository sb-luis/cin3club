import Schmervice from '@hapipal/schmervice';

export default class MediaItemListsService extends Schmervice.Service {
  async getAllLists({ creatorId }) {
    this.server.log(['info', 'list-service'], `READ MediaItemLists from user with id '${creatorId}'`);

    const { MediaItemList, MediaItem } = this.server.app.models;

    // Fetch data from DB
    let lists = await MediaItemList.findAll({
      where: {
        creatorId,
      },
      order: [['order', 'ASC']],
      include: {
        model: MediaItem,
        as: 'mediaItems',
        attributes: ['id'],
      },
      attributes: ['id', 'title', 'description', 'order'],
    });

    return { lists };
  }

  async getOneList({ id, creatorId, lang = 'en' }) {
    this.server.log(['info', 'list-service'], `READ MediaItemList '${id}', media items included`);

    const { MediaItemListMediaItem, MediaItemList, MediaItem, MediaItemLang } = this.server.app.models;

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
        through: MediaItemListMediaItem,
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

  async createOneList({ creatorId, title, description = '' }) {
    this.server.log(['info', 'lists-service'], `CREATE MediaItemList with title '${title}'`);

    const { MediaItemList } = this.server.app.models;
    const { connection } = this.server.app;
    // Start transaction...
    const transaction = await connection.transaction();

    try {
      // Get index of last list created (if any)
      const lastListCreated = await MediaItemList.findOne(
        {
          where: { creatorId },
          order: [['order', 'DESC']],
        },
        { transaction },
      );
      const order = lastListCreated ? lastListCreated.order + 1 : 1;

      // Create list
      const listData = {
        order,
        creatorId, // FK
        title,
        description,
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

  async updateListOrder({ lists, creatorId }) {
    this.server.log(['info', 'lists-service'], `UPDATE MediaItemLists order from user with id '${creatorId}'`);

    const { MediaItemList } = this.server.app.models;
    const { connection } = this.server.app;
    const result = [];
    // Start transaction...
    const transaction = await connection.transaction();

    try {
      console.log('lists');

      console.log(lists);

      // Using reduce to find the minimum 'order' value
      const minOrder = lists.reduce((min, obj) => (obj.order < min ? obj.order : min), Infinity);

      for (let i = 0; i < lists.length; i++) {
        const list = await MediaItemList.update(
          { order: minOrder + i },
          { where: { creatorId, id: lists[i].id } },
          { transaction },
        );
        result.push(list);
      }

      // If transaction went well...
      transaction.commit();

      console.log('MediaLists order updated successfully!');
      return result;
    } catch (err) {
      // If transaction went wrong...
      transaction.rollback();
      throw new Error(err);
    }
  }

  async updateOneList({ id, creatorId, title, description, mediaItems }) {
    this.server.log(['info', 'lists-service'], `UPDATE MediaItemList with id '${id}'`);

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

  async deleteOneList({ id, creatorId }) {
    this.server.log(['info', 'lists-service'], `DELETE MediaItemList with ${id}`);
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

  // CRUD operation of MediaItem within lists
  async createOneMediaItemInList({ mediaItemListId, mediaItem, creatorId }) {
    this.server.log(['info', 'lists-service'], `CREATE MediaItem inside MediaItemList with id '${mediaItemListId}'`);
    // Start transaction...
    const transaction = await connection.transaction();

    try {
      // Get index of last MediaItem created in list (if any)
      const lastMediaItemInList = await MediaItemListMediaItem.findOne(
        {
          where: { mediaItemListId },
          order: [['order', 'DESC']],
        },
        { transaction },
      );
      const order = lastMediaItemInList ? lastMediaItemInList.order + 1 : 1;

      // Check if MediaItem already exists in DB
      let existingItem = await MediaItem.findOne(
        {
          where: {
            tmdbId: mediaItem.tmdbId,
          },
        },
        { transaction },
      );

      if (!existingItem) {
        // If MediaItem doesn't exists, create one
        console.log(`No media item found in internal DB. Fetching from TMDB instead.`);
        const { tmdbService } = this.server.services();
        existingItem = await tmdbService.createMedia({ mediaItem, transaction });
      }

      // Add MediaItem to MediaItemList
      const result = await MediaItemListMediaItem.create({ order, mediaItemListId, mediaItemId: mediaItem.id });

      // If transaction went well...
      transaction.commit();

      return result.toJSON();
    } catch (err) {
      // If transaction went wrong...
      transaction.rollback();
      throw new Error(err);
    }
  }

  async updateMediaItemsOrderInList({ mediaItemListId, mediaItems }) {
    this.server.log(
      ['info', 'lists-service'],
      `UPDATE MediaItems order inside MediaItemList with id '${mediaItemListId}'`,
    );
    // TODO: authorise the user calling this method has the right permissions on this MediaItemList

    const { MediaItemListMediaItem } = this.server.app.models;
    const { connection } = this.server.app;
    const result = [];
    // Start transaction...
    const transaction = await connection.transaction();

    try {
      for (const { id, order } of mediaItems) {
        const list = await MediaItemListMediaItem.update(
          { order },
          { where: { mediaItemListId, mediaItemId: id } },
          { transaction },
        );
        result.push(list);
      }

      // If transaction went well...
      transaction.commit();

      console.log('MediaItems order in List updated successfully!');
      return result.toJSON();
    } catch (err) {
      // If transaction went wrong...
      transaction.rollback();
      throw new Error(err);
    }
  }

  async deleteOneMediaItemInList({ mediaItemListId, mediaItemId, id }) {
    this.server.log(
      ['info', 'lists-service'],
      `DELETE MediaItem with id '${mediaItemId}' inside MediaItemList with id '${mediaItemListId}'`,
    );
    // TODO: authorise the user calling this method has the right permissions on this MediaItemList

    const { MediaItemListMediaItem } = this.server.app.models;

    await MediaItemListMediaItem.destroy({ order }, { where: { mediaItemListId, mediaItemId, id } });
  }
}
