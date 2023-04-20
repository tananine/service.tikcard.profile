'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Contacts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      contactItemId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'ContactItems',
          key: 'id',
          as: 'contactItemId',
        },
      },
      profileId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Profiles',
          key: 'id',
          as: 'profileId',
        },
      },
      name: {
        type: Sequelize.STRING,
      },
      data: {
        type: Sequelize.STRING,
      },
      show: {
        type: Sequelize.ENUM('enable', 'disable'),
      },
      afterContactId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Contacts',
          key: 'id',
          as: 'afterContactId',
        },
      },
      note: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Contacts');
  },
};
