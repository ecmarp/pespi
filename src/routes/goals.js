const express = require('express');
const router = express.Router();
const { Goals } = require('../models');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateGoal = [
  body('goal_date').isDate().withMessage('Goal date must be a valid date'),
  body('desired_weightloss').optional().isFloat({ min: 0 }).withMessage('Weight loss must be a positive number'),
  body('desired_protein_intake').optional().isFloat({ min: 0 }).withMessage('Protein intake must be a positive number'),
  body('desired_calorie_intake').optional().isFloat({ min: 0 }).withMessage('Calorie intake must be a positive number'),
  body('desired_sleep').optional().isFloat({ min: 0, max: 24 }).withMessage('Sleep must be between 0 and 24 hours'),
  body('weekly_exercise').optional().isInt({ min: 0, max: 7 }).withMessage('Weekly exercise must be between 0 and 7'),
  body('workout_experience').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid workout experience level')
];

// Get all goals for the authenticated user
router.get('/', async (req, res) => {
  try {
    const goals = await Goals.findAll({
      where: { user_id: req.user.user_id },
      order: [['goal_date', 'DESC']]
    });
    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ message: 'Error fetching goals' });
  }
});

// Get a specific goal by ID
router.get('/:id', async (req, res) => {
  try {
    const goal = await Goals.findOne({
      where: { 
        goal_id: req.params.id,
        user_id: req.user.user_id
      }
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json(goal);
  } catch (error) {
    console.error('Error fetching goal:', error);
    res.status(500).json({ message: 'Error fetching goal' });
  }
});

// Create a new goal
router.post('/', validateGoal, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const goal = await Goals.create({
      ...req.body,
      user_id: req.user.user_id
    });
    
    res.status(201).json(goal);
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ message: 'Error creating goal' });
  }
});

// Update a goal
router.put('/:id', validateGoal, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const goal = await Goals.findOne({
      where: { 
        goal_id: req.params.id,
        user_id: req.user.user_id
      }
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    await goal.update(req.body);
    res.json(goal);
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ message: 'Error updating goal' });
  }
});

// Delete a goal
router.delete('/:id', async (req, res) => {
  try {
    const goal = await Goals.findOne({
      where: { 
        goal_id: req.params.id,
        user_id: req.user.user_id
      }
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    await goal.destroy();
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ message: 'Error deleting goal' });
  }
});

module.exports = router; 