const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WeightTracking = sequelize.define('WeightTracking', {
  weight_id: {
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
  recorded_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  weight: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false,
    comment: 'Weight in pounds'
  },
  body_fat_percentage: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: true,
    comment: 'Body fat percentage'
  },
  bmi: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: true,
    comment: 'Body Mass Index'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  indexes: [
    {
      fields: ['user_id', 'recorded_at']
    }
  ]
});

module.exports = WeightTracking; 