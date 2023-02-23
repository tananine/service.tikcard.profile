'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Activations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      accountId: {
        type: Sequelize.INTEGER,
      },
      primary: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Profiles',
          key: 'id',
          as: 'primary',
        },
      },
      secondary: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Profiles',
          key: 'id',
          as: 'secondary',
        },
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
    await queryInterface.dropTable('Activations');
  },
};
