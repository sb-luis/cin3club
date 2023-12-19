import { DataTypes } from 'sequelize';

export default {
  name: 'MediaList',
  schema: {
    // mediaItems (FK)
    // creator (FK)
    title: DataTypes.STRING,
    description: { 
        type: DataTypes.STRING, 
        defaultValue: '' 
    },
    status: {
        type: DataTypes.ENUM({values: ['private', 'public', 'hidden']}), 
        defaultValue: 'private'
    }
  },
};
