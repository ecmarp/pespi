const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { WeightTracking } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

// Validation middleware
const validateWeightEntry = [
  body('weight').isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
  body('recorded_at').isISO8601().withMessage('Valid recorded date is required')
];

// All routes are protected
router.use(authenticateToken);

// Log a new weight entry
router.post('/', validateWeightEntry, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Debug logging
    console.log('User from request:', req.user);
    console.log('Request body:', req.body);

    if (!req.user || !req.user.user_id) {
      console.error('Missing user_id in request:', req.user);
      return res.status(401).json({ message: 'User ID not found in request' });
    }

    const weightEntry = await WeightTracking.create({
      user_id: req.user.user_id,
      weight: req.body.weight,
      recorded_at: req.body.recorded_at,
      notes: req.body.notes
    });

    res.status(201).json({
      message: 'Weight logged successfully',
      weightEntry
    });
  } catch (error) {
    console.error('Error logging weight:', error);
    res.status(500).json({ 
      message: 'Server error logging weight',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get weight entries for a date range
router.get('/range', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ message: 'User ID not found in request' });
    }

    const weightEntries = await WeightTracking.findAll({
      where: {
        user_id: req.user.user_id,
        recorded_at: {
          [Op.between]: [start_date, end_date]
        }
      },
      order: [['recorded_at', 'ASC']]
    });

    res.json(weightEntries);
  } catch (error) {
    console.error('Error fetching weight entries:', error);
    res.status(500).json({ message: 'Error fetching weight entries' });
  }
});

// Get latest weight entry
router.get('/latest', async (req, res) => {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ message: 'User ID not found in request' });
    }

    const latestWeight = await WeightTracking.findOne({
      where: { user_id: req.user.user_id },
      order: [['recorded_at', 'DESC']]
    });

    res.json(latestWeight);
  } catch (error) {
    console.error('Error fetching latest weight:', error);
    res.status(500).json({ message: 'Error fetching latest weight' });
  }
});

module.exports = router; 