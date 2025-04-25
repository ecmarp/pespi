const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { MealTracking } = require('../models');

// Log a meal
router.post('/log', [
  body('meal_type').isIn(['breakfast', 'lunch', 'dinner', 'snack']).withMessage('Invalid meal type'),
  body('meal_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid meal time is required (HH:MM format)'),
  body('calories').isFloat({ min: 0 }).withMessage('Calories must be a positive number'),
  body('protein').isFloat({ min: 0 }).withMessage('Protein must be a positive number'),
  body('carbs').isFloat({ min: 0 }).withMessage('Carbs must be a positive number'),
  body('fats').isFloat({ min: 0 }).withMessage('Fats must be a positive number'),
  body('meal_name').notEmpty().withMessage('Meal name is required'),
  body('log_date').optional().isISO8601().withMessage('Valid log date is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Set log_date to today if not provided
    const logDate = req.body.log_date || new Date().toISOString().split('T')[0];

    // Create meal log
    const mealLog = await MealTracking.create({
      user_id: req.user.userId,
      log_date: logDate,
      meal_type: req.body.meal_type,
      meal_time: req.body.meal_time,
      calories: req.body.calories,
      protein: req.body.protein,
      carbs: req.body.carbs,
      fats: req.body.fats,
      meal_name: req.body.meal_name,
      notes: req.body.notes
    });

    res.status(201).json({
      message: 'Meal logged successfully',
      mealLog
    });
  } catch (error) {
    console.error('Meal logging error:', error);
    res.status(500).json({ message: 'Server error logging meal' });
  }
});

// Get meals for a specific date
router.get('/daily/:date', async (req, res) => {
  try {
    const { date } = req.params;

    const meals = await MealTracking.findAll({
      where: {
        user_id: req.user.userId,
        log_date: date
      },
      order: [['meal_time', 'ASC']]
    });

    // Calculate daily totals
    const dailyTotals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0
    };

    meals.forEach(meal => {
      dailyTotals.calories += parseFloat(meal.calories);
      dailyTotals.protein += parseFloat(meal.protein);
      dailyTotals.carbs += parseFloat(meal.carbs);
      dailyTotals.fats += parseFloat(meal.fats);
    });

    res.json({
      meals,
      dailyTotals
    });
  } catch (error) {
    console.error('Meal retrieval error:', error);
    res.status(500).json({ message: 'Server error retrieving meals' });
  }
});

// Get meal history (last 7 days)
router.get('/history', async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

    const meals = await MealTracking.findAll({
      where: {
        user_id: req.user.userId,
        log_date: {
          [sequelize.Op.gte]: sevenDaysAgoStr
        }
      },
      order: [['log_date', 'DESC'], ['meal_time', 'ASC']]
    });

    res.json({ meals });
  } catch (error) {
    console.error('Meal history retrieval error:', error);
    res.status(500).json({ message: 'Server error retrieving meal history' });
  }
});

// Get nutrition statistics
router.get('/stats', async (req, res) => {
  try {
    // Get average daily calories for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

    const dailyCalories = await MealTracking.findAll({
      where: {
        user_id: req.user.userId,
        log_date: {
          [sequelize.Op.gte]: sevenDaysAgoStr
        }
      },
      attributes: [
        'log_date',
        [sequelize.fn('SUM', sequelize.col('calories')), 'total_calories']
      ],
      group: ['log_date'],
      order: [['log_date', 'DESC']]
    });

    // Calculate average daily calories
    let totalCalories = 0;
    dailyCalories.forEach(day => {
      totalCalories += parseFloat(day.getDataValue('total_calories'));
    });
    const avgDailyCalories = dailyCalories.length > 0 ? totalCalories / dailyCalories.length : 0;

    // Get average macronutrient distribution
    const macroStats = await MealTracking.findAll({
      where: {
        user_id: req.user.userId,
        log_date: {
          [sequelize.Op.gte]: sevenDaysAgoStr
        }
      },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('protein')), 'avg_protein'],
        [sequelize.fn('AVG', sequelize.col('carbs')), 'avg_carbs'],
        [sequelize.fn('AVG', sequelize.col('fats')), 'avg_fats']
      ]
    });

    res.json({
      avgDailyCalories,
      dailyCalories,
      macroStats: macroStats[0] || { avg_protein: 0, avg_carbs: 0, avg_fats: 0 }
    });
  } catch (error) {
    console.error('Nutrition statistics error:', error);
    res.status(500).json({ message: 'Server error retrieving nutrition statistics' });
  }
});

module.exports = router; 