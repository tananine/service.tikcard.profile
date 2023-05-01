'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Info extends Model {
    static associate(models) {
      this.belongsTo(models.Profile, {
        foreignKey: 'profileId',
        onDelete: 'CASCADE',
      });
    }
  }
  Info.init(
    {
      profileId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      job: DataTypes.STRING,
      company: DataTypes.STRING,
      bio1: DataTypes.STRING,
      bio2: DataTypes.STRING,
      bio3: DataTypes.STRING,
      profileImage: DataTypes.STRING,
      logoImage: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Info',
    }
  );
  return Info;
};
