'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ContactItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      defaultUri: {
        type: Sequelize.STRING,
      },
      androidUri: {
        type: Sequelize.STRING,
      },
      iosUri: {
        type: Sequelize.STRING,
      },
      example: {
        type: Sequelize.STRING,
      },
      imageIcon: {
        type: Sequelize.STRING,
      },
      typeLayout: {
        type: Sequelize.ENUM('grid', 'block', 'spacial'),
      },
      component: {
        type: Sequelize.STRING,
      },
      type: {
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
    await queryInterface.dropTable('ContactItems');
  },
};
