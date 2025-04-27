const express = require('express');
const router = express.Router();
const { DailyLog, UserWorkouts, MealTracking } = require('../models');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateDailyLog = [
  body('log_date').isDate().withMessage('Log date must be a valid date'),
  body('user_sleep').optional().isFloat({ min: 0, max: 24 }).withMessage('Sleep must be between 0 and 24 hours'),
  body('avg_heartrate').optional().isInt({ min: 0, max: 250 }).withMessage('Heart rate must be between 0 and 250 BPM'),
  body('steps').optional().isInt({ min: 0 }).withMessage('Steps must be a positive number'),
  body('hydration').optional().isFloat({ min: 0 }).withMessage('Hydration must be a positive number')
];

// Get all daily logs for the authenticated user
router.get('/', async (req, res) => {
  try {
    const dailyLogs = await DailyLog.findAll({
      where: { user_id: req.user.user_id },
      order: [['log_date', 'DESC']]
    });
    res.json(dailyLogs);
  } catch (error) {
    console.error('Error fetching daily logs:', error);
    res.status(500).json({ message: 'Error fetching daily logs' });
  }
});

// Get a specific daily log by ID
router.get('/:id', async (req, res) => {
  try {
    const dailyLog = await DailyLog.findOne({
      where: { 
        log_id: req.params.id,
        user_id: req.user.user_id
      },
      include: [
        {
          model: UserWorkouts,
          as: 'workouts'
        },
        {
          model: MealTracking,
          as: 'meals'
        }
      ]
    });
    
    if (!dailyLog) {
      return res.status(404).json({ message: 'Daily log not found' });
    }
    
    res.json(dailyLog);
  } catch (error) {
    console.error('Error fetching daily log:', error);
    res.status(500).json({ message: 'Error fetching daily log' });
  }
});

// Get daily log by date
router.get('/date/:date', async (req, res) => {
  try {
    const dailyLog = await DailyLog.findOne({
      where: { 
        log_date: req.params.date,
        user_id: req.user.user_id
      },
      include: [
        {
          model: UserWorkouts,
          as: 'workouts'
        },
        {
          model: MealTracking,
          as: 'meals'
        }
      ]
    });
    
    if (!dailyLog) {
      return res.status(404).json({ message: 'Daily log not found for this date' });
    }
    
    res.json(dailyLog);
  } catch (error) {
    console.error('Error fetching daily log by date:', error);
    res.status(500).json({ message: 'Error fetching daily log by date' });
  }
});

// Create a new daily log
router.post('/', validateDailyLog, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Check if a log already exists for this date
    const existingLog = await DailyLog.findOne({
      where: { 
        log_date: req.body.log_date,
        user_id: req.user.user_id
      }
    });
    
    if (existingLog) {
      return res.status(400).json({ message: 'A log already exists for this date' });
    }
    
    const dailyLog = await DailyLog.create({
      ...req.body,
      user_id: req.user.user_id
    });
    
    res.status(201).json(dailyLog);
  } catch (error) {
    console.error('Error creating daily log:', error);
    res.status(500).json({ message: 'Error creating daily log' });
  }
});

// Update a daily log
router.put('/:id', validateDailyLog, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const dailyLog = await DailyLog.findOne({
      where: { 
        log_id: req.params.id,
        user_id: req.user.user_id
      }
    });
    
    if (!dailyLog) {
      return res.status(404).json({ message: 'Daily log not found' });
    }
    
    await dailyLog.update(req.body);
    res.json(dailyLog);
  } catch (error) {
    console.error('Error updating daily log:', error);
    res.status(500).json({ message: 'Error updating daily log' });
  }
});

// Delete a daily log
router.delete('/:id', async (req, res) => {
  try {
    const dailyLog = await DailyLog.findOne({
      where: { 
        log_id: req.params.id,
        user_id: req.user.user_id
      }
    });
    
    if (!dailyLog) {
      return res.status(404).json({ message: 'Daily log not found' });
    }
    
    await dailyLog.destroy();
    res.json({ message: 'Daily log deleted successfully' });
  } catch (error) {
    console.error('Error deleting daily log:', error);
    res.status(500).json({ message: 'Error deleting daily log' });
  }
});

module.exports = router; 