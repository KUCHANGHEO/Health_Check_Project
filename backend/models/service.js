'use strict';
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    server_info: DataTypes.TEXT,
    description: DataTypes.TEXT
  }, {});
  Service.associate = function(models) {
    // associations can be defined here
    Service.hasMany(models.StatusCheck, { foreignKey: 'service_id' });
  };
  return Service;
};
