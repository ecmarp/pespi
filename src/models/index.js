const sequelize = require('../config/database');
const User = require('./User');
const WorkoutTemplate = require('./WorkoutTemplate');
const UserWorkouts = require('./UserWorkouts');
const DailyLog = require('./DailyLog');
const Goals = require('./Goals');
const MealTracking = require('./MealTracking');
const WeightTracking = require('./WeightTracking');

// User - Trainer relationship
User.belongsTo(User, { as: 'trainer', foreignKey: 'trainer_id' });
User.hasMany(User, { as: 'clients', foreignKey: 'trainer_id' });

// User - Workouts relationship
User.hasMany(UserWorkouts, { foreignKey: 'user_id' });
UserWorkouts.belongsTo(User, { foreignKey: 'user_id' });

// WorkoutTemplate - UserWorkouts relationship
WorkoutTemplate.hasMany(UserWorkouts, { foreignKey: 'workout_id' });
UserWorkouts.belongsTo(WorkoutTemplate, { foreignKey: 'workout_id' });

// User - DailyLog relationship
User.hasMany(DailyLog, { foreignKey: 'user_id' });
DailyLog.belongsTo(User, { foreignKey: 'user_id' });

// User - Goals relationship
User.hasMany(Goals, { foreignKey: 'user_id' });
Goals.belongsTo(User, { foreignKey: 'user_id' });

// User - MealTracking relationship
User.hasMany(MealTracking, { foreignKey: 'user_id' });
MealTracking.belongsTo(User, { foreignKey: 'user_id' });

// User - WeightTracking relationship
User.hasMany(WeightTracking, { foreignKey: 'user_id' });
WeightTracking.belongsTo(User, { foreignKey: 'user_id' });

// DailyLog - MealTracking relationship
DailyLog.hasMany(MealTracking, { foreignKey: ['user_id', 'log_date'], constraints: false });
MealTracking.belongsTo(DailyLog, { foreignKey: ['user_id', 'log_date'], constraints: false });

// DailyLog - UserWorkouts relationship
DailyLog.hasMany(UserWorkouts, { foreignKey: ['user_id', 'log_date'], constraints: false });
UserWorkouts.belongsTo(DailyLog, { foreignKey: ['user_id', 'log_date'], constraints: false });

module.exports = {
  sequelize,
  User,
  WorkoutTemplate,
  UserWorkouts,
  DailyLog,
  Goals,
  MealTracking,
  WeightTracking
}; 