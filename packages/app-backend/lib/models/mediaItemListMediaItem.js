import { DataTypes } from 'sequelize';

export default {
  name: 'MediaItemListMediaItem',
  schema: {
    // junction table for
    // MediaItemList
    // and
    // MedaItem
    // models

    // Since the mediaItems associated with the list can be customly ordered we give them this property
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
};
