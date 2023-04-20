'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    static associate(models) {
      this.belongsTo(models.Profile, {
        foreignKey: 'profileId',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.ContactItem, {
        foreignKey: 'contactItemId',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.Contact, {
        foreignKey: 'afterContactId',
      });
    }
  }
  Contact.init(
    {
      contactItemId: DataTypes.INTEGER,
      profileId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      data: DataTypes.STRING,
      show: DataTypes.ENUM('enable', 'disable'),
      afterContactId: DataTypes.INTEGER,
      note: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Contact',
    }
  );
  return Contact;
};
