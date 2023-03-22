'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate(models) {
      this.hasOne(models.Info, {
        foreignKey: 'profileId',
      });
      this.hasMany(models.Contact, {
        foreignKey: 'profileId',
      });
    }
  }
  Profile.init(
    {
      accountId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      linkId: DataTypes.STRING,
      show: DataTypes.ENUM('enable', 'disable'),
    },
    {
      sequelize,
      modelName: 'Profile',
    }
  );
  return Profile;
};
