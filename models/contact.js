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
        onDelete: 'CASCADE',
      });
    }
  }
  Contact.init(
    {
      contactItemId: DataTypes.INTEGER,
      profileId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      urlUnique: DataTypes.STRING,
      type: DataTypes.STRING,
      status: DataTypes.ENUM('enable', 'disable'),
      theme: DataTypes.STRING,
      afterContactId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Contact',
    }
  );
  return Contact;
};
