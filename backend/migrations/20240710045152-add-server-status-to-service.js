"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Services", "server_status", {
      type: Sequelize.ENUM("up", "down", "wait"),
      allowNull: false,
      defaultValue: "wait", // 기본값 설정
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Services", "server_status");
  },
};
