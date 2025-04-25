const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  logMeal,
  getMealsByDate,
  getNutritionSummary,
  updateMeal,
  deleteMeal
} = require('../controllers/mealTrackingController');

// All routes are protected and require authentication
router.use(protect);

// Log a new meal
router.post('/', logMeal);

// Get meals for a specific date
router.get('/date/:date', getMealsByDate);

// Get nutrition summary for a date range
router.get('/summary', getNutritionSummary);

// Update a meal entry
router.put('/:id', updateMeal);

// Delete a meal entry
router.delete('/:id', deleteMeal);

module.exports = router; 