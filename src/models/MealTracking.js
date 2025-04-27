const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
  fat: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  meal_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  meal_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  meal_photo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  meal_rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  meal_notes: {
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

module.exports = MealTracking; 