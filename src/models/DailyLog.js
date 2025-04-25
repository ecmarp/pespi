const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DailyLog = sequelize.define('DailyLog', {
  log_id: {
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
  user_sleep: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: true,
    comment: 'Hours of sleep'
  },
  avg_heartrate: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Average heart rate in BPM'
  },
  steps: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  hydration: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Liters of water consumed'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'log_date']
    }
  ]
});

module.exports = DailyLog; 