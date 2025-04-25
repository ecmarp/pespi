const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { isTrainer } = require('../middleware/auth');

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Profile retrieval error:', error);
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
});

// Update user profile
router.put('/profile', [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('age').optional().isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  body('fitness_goal').optional().notEmpty().withMessage('Fitness goal cannot be empty'),
  body('user_height').optional().isFloat({ min: 0 }).withMessage('Height must be a positive number'),
  body('trainer_id').optional().isInt().withMessage('trainer_id must be an integer')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    const updateFields = ['name', 'age', 'gender', 'fitness_goal', 'user_height', 'trainer_id'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    // Return updated user (excluding password)
    const userData = user.toJSON();
    delete userData.password;

    res.json({
      message: 'Profile updated successfully',
      user: userData
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Change password
router.put('/change-password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await user.validatePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword; // Will be hashed by the model hook
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Server error changing password' });
  }
});

// Get all trainers (for clients to select a trainer)
router.get('/trainers', async (req, res) => {
  try {
    const trainers = await User.findAll({
      where: { is_trainer: true },
      attributes: ['user_id', 'name', 'email', 'fitness_goal', 'user_height'],
      order: [['name', 'ASC']]
    });

    res.json({ trainers });
  } catch (error) {
    console.error('Trainer retrieval error:', error);
    res.status(500).json({ message: 'Server error retrieving trainers' });
  }
});

// Get trainer's clients (for trainers only)
router.get('/clients', isTrainer, async (req, res) => {
  try {
    const clients = await User.findAll({
      where: { trainer_id: req.user.userId },
      attributes: { exclude: ['password'] },
      order: [['name', 'ASC']]
    });

    res.json({ clients });
  } catch (error) {
    console.error('Client retrieval error:', error);
    res.status(500).json({ message: 'Server error retrieving clients' });
  }
});

module.exports = router; 