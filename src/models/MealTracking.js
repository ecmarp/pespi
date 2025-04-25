const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MealTracking = sequelize.define('MealTracking', {
  meal_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'user_id'
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
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false
  },
  protein: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false,
    comment: 'Protein content in grams'
  },
  carbs: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false,
    comment: 'Carbohydrate content in grams'
  },
  fats: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false,
    comment: 'Fat content in grams'
  },
  meal_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  indexes: [
    {
      fields: ['user_id', 'log_date']
    }
  ]
});

module.exports = MealTracking; 