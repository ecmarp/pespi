const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { WorkoutTemplate, UserWorkouts, sequelize } = require('../models');
const { isTrainer } = require('../middleware/auth');

// Get all workout templates
router.get('/templates', async (req, res) => {
  try {
    const templates = await WorkoutTemplate.findAll({
      order: [['exercise_name', 'ASC']]
    });

    res.json({ templates });
  } catch (error) {
    console.error('Workout template retrieval error:', error);
    res.status(500).json({ message: 'Server error retrieving workout templates' });
  }
});

// Get workout templates by difficulty level
router.get('/templates/difficulty/:level', [
  body('level').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid difficulty level')
], async (req, res) => {
  try {
    const { level } = req.params;

    const templates = await WorkoutTemplate.findAll({
      where: { difficulty_level: level },
      order: [['exercise_name', 'ASC']]
    });

    res.json({ templates });
  } catch (error) {
    console.error('Workout template retrieval error:', error);
    res.status(500).json({ message: 'Server error retrieving workout templates' });
  }
});

// Get workout templates by muscle group
router.get('/templates/muscle/:group', async (req, res) => {
  try {
    const { group } = req.params;

    const templates = await WorkoutTemplate.findAll({
      where: { muscle_group: group },
      order: [['exercise_name', 'ASC']]
    });

    res.json({ templates });
  } catch (error) {
    console.error('Workout template retrieval error:', error);
    res.status(500).json({ message: 'Server error retrieving workout templates' });
  }
});

// Create a new workout template (trainers only)
router.post('/templates', isTrainer, [
  body('exercise_name').notEmpty().withMessage('Exercise name is required'),
  body('exercise_type').notEmpty().withMessage('Exercise type is required'),
  body('default_calories').isFloat({ min: 0 }).withMessage('Default calories must be a positive number'),
  body('avg_duration_min').isInt({ min: 1 }).withMessage('Average duration must be at least 1 minute'),
  body('muscle_group').notEmpty().withMessage('Muscle group is required'),
  body('difficulty_level').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid difficulty level')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const template = await WorkoutTemplate.create(req.body);

    res.status(201).json({
      message: 'Workout template created successfully',
      template
    });
  } catch (error) {
    console.error('Workout template creation error:', error);
    res.status(500).json({ message: 'Server error creating workout template' });
  }
});

// Log a workout
router.post('/log', [
  body('workout_id').isInt().withMessage('Workout ID is required'),
  body('sets').isInt({ min: 1 }).withMessage('Sets must be at least 1'),
  body('reps').isInt({ min: 1 }).withMessage('Reps must be at least 1'),
  body('duration_min').isInt({ min: 1 }).withMessage('Duration must be at least 1 minute'),
  body('workout_date').isISO8601().withMessage('Valid workout date is required'),
  body('notes').optional().isString()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if workout template exists
    const template = await WorkoutTemplate.findByPk(req.body.workout_id);
    if (!template) {
      return res.status(404).json({ message: 'Workout template not found' });
    }

    // Create workout log
    const workoutLog = await UserWorkouts.create({
      user_id: req.user.userId,
      workout_id: req.body.workout_id,
      log_date: new Date().toISOString().split('T')[0], // Today's date
      sets: req.body.sets,
      reps: req.body.reps,
      duration_min: req.body.duration_min,
      calories_burned: req.body.calories_burned || template.default_calories,
      workout_date: req.body.workout_date,
      notes: req.body.notes
    });

    res.status(201).json({
      message: 'Workout logged successfully',
      workoutLog
    });
  } catch (error) {
    console.error('Workout logging error:', error);
    res.status(500).json({ message: 'Server error logging workout' });
  }
});

// Get user's workout history
router.get('/history', async (req, res) => {
  try {
    const workouts = await UserWorkouts.findAll({
      where: { user_id: req.user.userId },
      include: [{
        model: WorkoutTemplate,
        attributes: ['exercise_name', 'exercise_type', 'muscle_group', 'difficulty_level']
      }],
      order: [['workout_date', 'DESC']]
    });

    res.json({ workouts });
  } catch (error) {
    console.error('Workout history retrieval error:', error);
    res.status(500).json({ message: 'Server error retrieving workout history' });
  }
});

// Get workout statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total workouts
    const totalWorkouts = await UserWorkouts.count({
      where: { user_id: req.user.userId }
    });

    // Get total calories burned
    const totalCalories = await UserWorkouts.sum('calories_burned', {
      where: { user_id: req.user.userId }
    });

    // Get workouts by muscle group
    const workoutsByMuscleGroup = await UserWorkouts.findAll({
      where: { user_id: req.user.userId },
      include: [{
        model: WorkoutTemplate,
        attributes: ['muscle_group']
      }],
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('UserWorkouts.user_workout_id')), 'count']
      ],
      group: ['WorkoutTemplate.muscle_group']
    });

    // Get recent workouts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentWorkouts = await UserWorkouts.count({
      where: {
        user_id: req.user.userId,
        workout_date: {
          [sequelize.Op.gte]: sevenDaysAgo
        }
      }
    });

    res.json({
      totalWorkouts,
      totalCalories: totalCalories || 0,
      workoutsByMuscleGroup,
      recentWorkouts
    });
  } catch (error) {
    console.error('Workout statistics error:', error);
    res.status(500).json({ message: 'Server error retrieving workout statistics' });
  }
});

// Delete a workout log
router.delete('/log/:id', async (req, res) => {
  try {
    const workoutId = req.params.id;
    
    // Find the workout and verify it belongs to the user
    const workout = await UserWorkouts.findOne({
      where: {
        user_workout_id: workoutId,
        user_id: req.user.userId
      }
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found or unauthorized' });
    }

    // Delete the workout
    await workout.destroy();

    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Workout deletion error:', error);
    res.status(500).json({ message: 'Server error deleting workout' });
  }
});

module.exports = router; 