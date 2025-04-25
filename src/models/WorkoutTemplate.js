const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkoutTemplate = sequelize.define('WorkoutTemplate', {
  workout_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  exercise_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  exercise_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  default_calories: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false
  },
  avg_duration_min: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  muscle_group: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  difficulty_level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    allowNull: false,
    defaultValue: 'intermediate'
  }
});

module.exports = WorkoutTemplate; 