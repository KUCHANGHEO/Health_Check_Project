"use strict";
module.exports = (sequelize, DataTypes) => {
  const StatusCheck = sequelize.define(
    "StatusCheck",
    {
      service_id: DataTypes.INTEGER,
      check_time: DataTypes.DATE,
      response_time: DataTypes.INTEGER,
      status_code: DataTypes.INTEGER,
    },
    {}
  );
  StatusCheck.associate = function (models) {
    // associations can be defined here
    StatusCheck.belongsTo(models.Service, { foreignKey: "service_id" });
  };
  return StatusCheck;
};
