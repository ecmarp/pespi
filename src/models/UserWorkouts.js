const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserWorkouts = sequelize.define('UserWorkouts', {
  user_workout_id: {
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
  workout_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'WorkoutTemplates',
      key: 'workout_id'
    }
  },
  log_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  sets: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reps: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  duration_min: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  calories_burned: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true
  },
  workout_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  indexes: [
    {
      fields: ['user_id', 'workout_date']
    }
  ]
});

module.exports = UserWorkouts; 