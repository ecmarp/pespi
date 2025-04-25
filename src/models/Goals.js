const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Goals = sequelize.define('Goals', {
  goal_id: {
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
  goal_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  desired_weightloss: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
    comment: 'Target weight loss in pounds'
  },
  desired_protein_intake: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
    comment: 'Target protein intake in grams'
  },
  desired_calorie_intake: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
    comment: 'Target daily calorie intake'
  },
  desired_sleep: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: true,
    comment: 'Target hours of sleep'
  },
  weekly_exercise: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Target number of exercise sessions per week'
  },
  workout_experience: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  indexes: [
    {
      fields: ['user_id', 'goal_date']
    }
  ]
});

module.exports = Goals; 