'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContactItem extends Model {
    static associate(models) {
      this.hasMany(models.Contact, {
        foreignKey: 'contactItemId',
      });
    }
  }
  ContactItem.init(
    {
      name: DataTypes.STRING,
      app: DataTypes.STRING,
      url: DataTypes.STRING,
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'ContactItem',
    }
  );
  return ContactItem;
};
