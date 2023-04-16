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
      bio: DataTypes.STRING,
      work: DataTypes.STRING,
      company: DataTypes.STRING,
      position: DataTypes.STRING,
      address: DataTypes.STRING,
      profileImage: DataTypes.STRING,
      companyImage: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Info',
    }
  );
  return Info;
};
