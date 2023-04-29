'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Connection extends Model {
    static associate(models) {
      this.belongsTo(models.Profile, {
        foreignKey: 'profileId',
        onDelete: 'CASCADE',
      });
    }
  }
  Connection.init(
    {
      profileId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      phone: DataTypes.INTEGER,
      email: DataTypes.STRING,
      message: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Connection',
    }
  );
  return Connection;
};
