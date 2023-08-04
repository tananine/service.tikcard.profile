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
      defaultUri: DataTypes.STRING,
      androidUri: DataTypes.STRING,
      iosUri: DataTypes.STRING,
      example: DataTypes.STRING,
      imageIcon: DataTypes.STRING,
      typeLayout: DataTypes.ENUM('grid', 'block', 'spacial'),
      component: DataTypes.STRING,
      type: DataTypes.ENUM('number', 'email', 'link'),
      inputType: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'ContactItem',
    }
  );
  return ContactItem;
};
