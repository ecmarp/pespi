import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
} from '@mui/material';
import {
  FitnessCenter as WorkoutIcon,
  Restaurant as MealIcon,
  Scale as WeightIcon,
  TrendingUp as WeightChangeIcon,
  LocalFireDepartment as CaloriesIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface Workout {
  id: number;
  name: string;
  duration: number;
  caloriesBurned: number;
}

interface Meal {
  id: number;
  meal_name: string;
  meal_type: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_time: string;
}

interface DayDetailProps {
  date: Date;
  workouts: Workout[];
  meals: Meal[];
  weight?: number;
  weightChange?: number;
  totalCalories?: number;
  onWorkoutDeleted?: (workoutId: number) => void;
}

const DayDetail: React.FC<DayDetailProps> = ({
  date,
  workouts = [],
  meals = [],
  weight,
  weightChange,
  totalCalories = 0,
  onWorkoutDeleted,
}) => {
  const { token } = useAuth();

  const handleDeleteWorkout = async (workoutId: number) => {
    try {
      console.log('Attempting to delete workout with ID:', workoutId);
      console.log('Current workouts array:', workouts);
      console.log('Using token:', token);
      console.log('Full delete URL:', `${API_BASE_URL}/workouts/log/${workoutId}`);

      const response = await axios.delete(`${API_BASE_URL}/workouts/log/${workoutId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Delete response:', response);

      // Only notify parent component about the deletion if the request was successful
      if (onWorkoutDeleted) {
        console.log('Notifying parent of successful deletion for workout ID:', workoutId);
        await onWorkoutDeleted(workoutId);
      }
    } catch (error: any) {
      console.error('Full error object:', error);
      console.error('Error response:', error.response);
      console.error('Error request config:', error.config);
      alert('Failed to delete workout. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate total calories burned from workouts
  const totalCaloriesBurned = workouts.reduce((total, workout) => total + workout.caloriesBurned, 0);

  // Calculate total calories consumed from meals
  const totalCaloriesConsumed = meals.reduce((total, meal) => total + meal.calories, 0);

  // Calculate net calories (consumed - burned)
  const netCalories = totalCaloriesConsumed - totalCaloriesBurned;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {formatDate(date)}
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Summary Section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        {weight !== undefined && (
          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <WeightIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">{weight} lbs</Typography>
              <Typography variant="body2" color="textSecondary">Current Weight</Typography>
            </Paper>
          </Box>
        )}
        
        {weightChange !== undefined && (
          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <WeightChangeIcon color={weightChange < 0 ? 'success' : 'error'} sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" color={weightChange < 0 ? 'success.main' : 'error.main'}>
                {weightChange > 0 ? '+' : ''}{weightChange} lbs
              </Typography>
              <Typography variant="body2" color="textSecondary">Weight Change</Typography>
            </Paper>
          </Box>
        )}
        
        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <CaloriesIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">{totalCaloriesConsumed}</Typography>
            <Typography variant="body2" color="textSecondary">Calories Consumed</Typography>
          </Paper>
        </Box>
        
        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <CaloriesIcon color={netCalories < 0 ? 'success' : 'error'} sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" color={netCalories < 0 ? 'success.main' : 'error.main'}>
              {netCalories}
            </Typography>
            <Typography variant="body2" color="textSecondary">Net Calories</Typography>
          </Paper>
        </Box>
      </Box>
      
      {/* Workouts Section */}
      <Typography variant="h6" gutterBottom>
        Workouts
      </Typography>
      
      {workouts.length > 0 ? (
        <List>
          {workouts.map((workout) => (
            <ListItem 
              key={workout.id} 
              divider
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={() => handleDeleteWorkout(workout.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemIcon>
                <WorkoutIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary={workout.name}
                secondary={`${workout.caloriesBurned} calories burned`}
              />
              <Chip 
                label={`${workout.caloriesBurned} cal`} 
                color="primary" 
                variant="outlined" 
                size="small" 
                sx={{ mr: 2 }}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography color="textSecondary" sx={{ mb: 2 }}>
          No workouts recorded for this day.
        </Typography>
      )}
      
      {/* Meals Section */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Meals
      </Typography>
      
      {meals.length > 0 ? (
        <List>
          {meals.map((meal) => (
            <ListItem key={meal.id} divider>
              <ListItemIcon>
                <MealIcon color="secondary" />
              </ListItemIcon>
              <ListItemText 
                primary={`${meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1)} - ${meal.meal_name}`}
                secondary={`${meal.meal_time} • P: ${meal.protein}g • C: ${meal.carbs}g • F: ${meal.fat}g`}
              />
              <Chip 
                label={`${meal.calories} cal`} 
                color="secondary" 
                variant="outlined" 
                size="small" 
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography color="textSecondary">
          No meals recorded for this day.
        </Typography>
      )}
    </Paper>
  );
};

export default DayDetail; 