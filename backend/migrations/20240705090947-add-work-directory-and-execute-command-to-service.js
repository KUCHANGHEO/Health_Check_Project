"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Services", "work_directory", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Services", "execute_command", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Services", "work_directory");
    await queryInterface.removeColumn("Services", "execute_command");
  },
};
