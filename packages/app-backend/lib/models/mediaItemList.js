import { DataTypes } from 'sequelize';

export default {
  name: 'MediaItemList',
  schema: {
    // creatorId (FK)
    title: DataTypes.STRING,
    description: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    status: {
      type: DataTypes.ENUM({ values: ['private', 'public', 'hidden'] }),
      defaultValue: 'private',
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
};
