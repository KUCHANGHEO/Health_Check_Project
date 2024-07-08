module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define(
    "Service",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      server_info: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      work_directory: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      execute_command: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  Service.associate = (models) => {
    Service.hasMany(models.StatusCheck, { foreignKey: "service_id" });
  };

  return Service;
};
