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
      server_status: {
        type: DataTypes.ENUM("up", "down", "wait", "skipped"),
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
      tags: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      fail_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
    }
  );

  Service.associate = (models) => {
    Service.hasMany(models.StatusCheck, {
      foreignKey: "service_id",
      as: "StatusChecks",
    });
  };

  return Service;
};
