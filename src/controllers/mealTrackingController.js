const { MealTracking } = require('../models');
const { Op } = require('sequelize');

// Log a new meal
exports.logMeal = async (req, res) => {
  try {
    const {
      log_date,
      meal_type,
      meal_time,
      calories,
      protein,
      carbs,
      fats,
      meal_name,
      notes
    } = req.body;

    const meal = await MealTracking.create({
      user_id: req.user.id,
      log_date,
      meal_type,
      meal_time,
      calories,
      protein,
      carbs,
      fats,
      meal_name,
      notes
    });

    res.status(201).json({
      success: true,
      data: meal
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get meals for a specific date
exports.getMealsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const meals = await MealTracking.findAll({
      where: {
        user_id: req.user.id,
        log_date: date
      },
      order: [['meal_time', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: meals
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get nutrition summary for a date range
exports.getNutritionSummary = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    const meals = await MealTracking.findAll({
      where: {
        user_id: req.user.id,
        log_date: {
          [Op.between]: [start_date, end_date]
        }
      }
    });

    const summary = {
      total_calories: meals.reduce((sum, meal) => sum + meal.calories, 0),
      total_protein: meals.reduce((sum, meal) => sum + meal.protein, 0),
      total_carbs: meals.reduce((sum, meal) => sum + meal.carbs, 0),
      total_fats: meals.reduce((sum, meal) => sum + meal.fats, 0),
      meal_count: meals.length,
      daily_averages: {
        calories: meals.reduce((sum, meal) => sum + meal.calories, 0) / meals.length,
        protein: meals.reduce((sum, meal) => sum + meal.protein, 0) / meals.length,
        carbs: meals.reduce((sum, meal) => sum + meal.carbs, 0) / meals.length,
        fats: meals.reduce((sum, meal) => sum + meal.fats, 0) / meals.length
      }
    };

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update a meal entry
exports.updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const meal = await MealTracking.findOne({
      where: {
        id,
        user_id: req.user.id
      }
    });

    if (!meal) {
      return res.status(404).json({
        success: false,
        error: 'Meal not found'
      });
    }

    await meal.update(updateData);

    res.status(200).json({
      success: true,
      data: meal
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete a meal entry
exports.deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;

    const meal = await MealTracking.findOne({
      where: {
        id,
        user_id: req.user.id
      }
    });

    if (!meal) {
      return res.status(404).json({
        success: false,
        error: 'Meal not found'
      });
    }

    await meal.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 