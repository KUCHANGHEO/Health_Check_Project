"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Services", "server_status", {
      type: Sequelize.ENUM("up", "down", "wait", "skipped"),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Services", "server_status", {
      type: Sequelize.ENUM("up", "down", "wait"),
      allowNull: false,
    });
  },
};
