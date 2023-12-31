export default async function (models) {
  // Set up Sequelize associations
  // https://sequelize.org/docs/v6/core-concepts/assocs/
  const { User, Session, MediaItem, MediaItemLang, MediaItemRating, MediaItemList, MediaItemListMediaItem } = models;

  // --- One-To-One associations ---
  // Note how the foreignKey in the 'belongsTo' association should point to the foreign key in the model where the association is defined
  Session.belongsTo(User, { as: 'user', foreignKey: 'userId' });
  MediaItemRating.belongsTo(User, { as: 'user', foreignKey: 'userId' });
  MediaItemRating.belongsTo(MediaItem, { as: 'mediaItem', foreignKey: 'mediaItemId' });

  // --- One-To-Many associations ---
  // Note how the foreignKey in the 'belongsTo' association should point to the foreign key in the model where the association is defined
  MediaItem.hasMany(MediaItemLang, { as: 'mediaItemLangs', foreignKey: 'mediaItemId' });
  MediaItemLang.belongsTo(MediaItem, { as: 'mediaItem', foreignKey: 'mediaItemId' });
  User.hasMany(MediaItemList, { as: 'mediaItemLists', foreignKey: 'creatorId' });
  MediaItemList.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' });

  // --- Many-to-Many associations ---
  // In a many-to-many relationship, you typically use the belongsToMany method on both models involved in the association.
  // Each belongsToMany call includes the association options and specifies the through model.
  MediaItemList.belongsToMany(MediaItem, {
    through: MediaItemListMediaItem,
    as: 'mediaItems',
    foreignKey: 'mediaItemListId',
  });
  MediaItem.belongsToMany(MediaItemList, {
    through: MediaItemListMediaItem,
    as: 'mediaItemLists',
    foreignKey: 'mediaItemId',
  });
}
