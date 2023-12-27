
export default async function(models){
    // Set up Sequelize associations
    // https://sequelize.org/docs/v6/core-concepts/assocs/
    const { User, Session, Rating, MediaItem, MediaItemLang, MediaItemList, MediaItemListMediaItem } = models;

    // --- One-To-One associations ---
    // Add `userId` foreign key in Session and Rating
    Session.belongsTo(User, { as: 'user', foreignKey: 'userId' });
    Rating.belongsTo(User, { as: 'user', foreignKey: 'userId' });
    // Add `mediaItemId` foreign key in Rating
    Rating.belongsTo(MediaItem, { as: 'mediaItem', foreignKey: 'mediaItemId' });
    // Add `userId` foreign key in MediaItemList 
    MediaItemList.belongsTo(User, { as: 'user', foreignKey: 'creatorId' });

    // --- One-To-Many associations ---
    // Add `mediaItemId` foreign key in MediaItemLang
    MediaItem.hasMany(MediaItemLang, { as: 'mediaItemLangs', foreignKey: 'mediaItemId' });
    MediaItemLang.belongsTo(MediaItem, { foreignKey: 'mediaItemId' });

    // --- Many-to-Many associations ---
    MediaItemList.belongsToMany(MediaItem, { through: MediaItemListMediaItem, as: 'mediaItems' });
    MediaItem.belongsToMany(MediaItemList, { through: MediaItemListMediaItem, as: 'lists' });

};
