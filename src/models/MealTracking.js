const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MealTracking = sequelize.define('MealTracking', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    log_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    meal_type: {
      type: DataTypes.ENUM('breakfast', 'lunch', 'dinner', 'snack'),
      allowNull: false
    },
    meal_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    calories: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    protein: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    carbs: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    fats: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    meal_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'meal_tracking',
    timestamps: true,
    indexes: [
      {
        fields: ['user_id', 'log_date']
      }
    ]
  });

  MealTracking.associate = (models) => {
    MealTracking.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return MealTracking;
}; 