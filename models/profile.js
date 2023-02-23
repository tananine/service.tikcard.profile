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
      accountId: DataTypes.NUMBER,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Profile',
    }
  );
  return Profile;
};
