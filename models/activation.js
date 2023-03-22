'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Activation extends Model {
    static associate(models) {
      this.belongsTo(models.Profile, {
        foreignKey: 'primary',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.Profile, {
        foreignKey: 'secondary',
        onDelete: 'CASCADE',
      });
    }
  }
  Activation.init(
    {
      accountId: DataTypes.INTEGER,
      primary: DataTypes.INTEGER,
      secondary: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Activation',
    }
  );
  return Activation;
};
