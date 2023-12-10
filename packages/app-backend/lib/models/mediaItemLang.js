import { DataTypes } from 'sequelize';

export default {
  name: 'MediaItemLang',
  schema: {
    tmdbId: DataTypes.INTEGER,
    lang: DataTypes.STRING, // for i18n support
    title: DataTypes.STRING,
    posterPath: DataTypes.STRING,
    overview: DataTypes.TEXT('medium'),
  },
};
