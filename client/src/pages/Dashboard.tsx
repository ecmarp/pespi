import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Button,
  styled,
} from '@mui/material';
import {
  FitnessCenter as WorkoutIcon,
  Restaurant as NutritionIcon,
  TrendingUp as ProgressIcon,
  Add as AddIcon,
  Scale as ScaleIcon,
} from '@mui/icons-material';
import Calendar from '../components/Calendar';
import DayDetail from '../components/DayDetail';
import AddWorkoutDialog from '../components/AddWorkoutDialog';
import AddMealDialog from '../components/AddMealDialog';
import AddWeightDialog from '../components/AddWeightDialog';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Define types for our data
interface DayData {
  hasWorkout: boolean;
  hasMeal: boolean;
  weight?: number;
  workouts: Array<{
    id: number;
    name: string;
    sets: number;
    reps: number;
    caloriesBurned: number;
  }>;
  totalCalories: number;
}

interface DayDataMap {
  [key: string]: DayData;
}

// Styled components
const QuickActionButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));

const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [dayData, setDayData] = useState<DayDataMap>({});
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [meals, setMeals] = useState<any[]>([]);
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [isAddWorkoutOpen, setIsAddWorkoutOpen] = useState(false);
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [isAddWeightOpen, setIsAddWeightOpen] = useState(false);

  // Add useEffect to fetch meals when selectedDate changes
  useEffect(() => {
    const fetchMeals = async () => {
      if (!selectedDate || !token) return;
      
      try {
        const dateStr = selectedDate.toISOString().split('T')[0];
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/meals/daily/${dateStr}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        setMeals(response.data.meals || []);
        
        // Update dayData with the meal information
        setDayData(prevData => ({
          ...prevData,
          [dateStr]: {
            ...prevData[dateStr],
            hasMeal: response.data.meals.length > 0,
            totalCalories: response.data.dailyTotals?.calories || 0
          }
        }));
      } catch (error) {
        console.error('Error fetching meals:', error);
      }
    };

    fetchMeals();
  }, [selectedDate, token]);

  const handleDaySelect = (date: Date) => {
    setSelectedDate(date);
    const dateKey = date.toISOString().split('T')[0];
    const dayInfo = dayData[dateKey];
    
    if (dayInfo) {
      setWorkouts(dayInfo.workouts || []);
      setWeight(dayInfo.weight);
    } else {
      setWorkouts([]);
      setWeight(undefined);
    }
  };

  const handleAddWorkout = () => {
    setIsAddWorkoutOpen(true);
  };

  const handleAddMeal = () => {
    setIsAddMealOpen(true);
  };

  const handleLogWeight = () => {
    setIsAddWeightOpen(true);
  };

  const handleWeightAdded = (newWeight: number) => {
    setWeight(newWeight);
    // Update the dayData with the new weight
    const dateKey = selectedDate?.toISOString().split('T')[0];
    if (dateKey) {
      setDayData(prev => ({
        ...prev,
        [dateKey]: {
          ...prev[dateKey],
          weight: newWeight
        }
      }));
    }
  };

  const handleWorkoutAdded = (workoutDetails: { 
    date: string; 
    totalCalories: number; 
    workouts: Array<{
      id: number;
      name: string;
      sets: number;
      reps: number;
      caloriesBurned: number;
    }>;
  }) => {
    // Update the day data with the new workout information
    setDayData(prevData => ({
      ...prevData,
      [workoutDetails.date]: {
        ...prevData[workoutDetails.date],
        hasWorkout: true,
        workouts: workoutDetails.workouts,
        totalCalories: workoutDetails.totalCalories
      }
    }));

    // If the selected date matches the workout date, update the workouts state
    if (selectedDate?.toISOString().split('T')[0] === workoutDetails.date) {
      setWorkouts(workoutDetails.workouts);
    }
  };

  const handleWorkoutDeleted = async (workoutId: number) => {
    console.log('Attempting to delete workout with ID:', workoutId);
    
    // Update workouts state immediately for UI responsiveness
    setWorkouts(prevWorkouts => {
      console.log('Current workouts:', prevWorkouts);
      return prevWorkouts.filter(w => w.id !== workoutId);
    });

    // Update dayData state
    if (selectedDate) {
      const dateKey = selectedDate.toISOString().split('T')[0];
      setDayData(prevData => {
        const dayInfo = prevData[dateKey];
        if (dayInfo && dayInfo.workouts) {
          console.log('Current day workouts:', dayInfo.workouts);
          const deletedWorkout = dayInfo.workouts.find(w => w.id === workoutId);
          console.log('Workout to delete:', deletedWorkout);
          const updatedWorkouts = dayInfo.workouts.filter(w => w.id !== workoutId);
          
          return {
            ...prevData,
            [dateKey]: {
              ...dayInfo,
              workouts: updatedWorkouts,
              totalCalories: dayInfo.totalCalories - (deletedWorkout?.caloriesBurned || 0),
              hasWorkout: updatedWorkouts.length > 0
            }
          };
        }
        return prevData;
      });
    }
  };

  const handleMealAdded = (mealDetails: any) => {
    // Update the meals state with the new meal
    setMeals(prevMeals => [...prevMeals, mealDetails]);
    
    // Update the day data
    const dateKey = selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0];
    setDayData(prevData => ({
      ...prevData,
      [dateKey]: {
        ...prevData[dateKey],
        hasMeal: true,
        totalCalories: (prevData[dateKey]?.totalCalories || 0) + mealDetails.calories
      }
    }));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        mb: 3
      }}>
        {/* Summary Cards */}
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <WorkoutIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6">Workouts</Typography>
                <Typography variant="h4">12</Typography>
                <Typography color="textSecondary">This Month</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <NutritionIcon sx={{ fontSize: 40, mr: 2, color: 'secondary.main' }} />
              <Box>
                <Typography variant="h6">Calories</Typography>
                <Typography variant="h4">2,100</Typography>
                <Typography color="textSecondary">Daily Average</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <ProgressIcon sx={{ fontSize: 40, mr: 2, color: 'success.main' }} />
              <Box>
                <Typography variant="h6">Progress</Typography>
                <Typography variant="h4">85%</Typography>
                <Typography color="textSecondary">Goal Completion</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Calendar and Day Detail Section */}
      <Grid container spacing={2}>
        <Grid size={7}>
          <Calendar 
            onDaySelect={handleDaySelect} 
            selectedDate={selectedDate}
            dayData={dayData}
          />
        </Grid>
        <Grid size={5}>
          {selectedDate ? (
            <DayDetail 
              date={selectedDate}
              workouts={workouts}
              meals={meals}
              weight={weight}
              totalCalories={dayData[selectedDate.toISOString().split('T')[0]]?.totalCalories}
              onWorkoutDeleted={handleWorkoutDeleted}
            />
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">
                Select a date to view details
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
      
      {/* Quick Actions Section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 3 }}>
        <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
          <QuickActionButton
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddWorkout}
          >
            Add Workout
          </QuickActionButton>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
          <QuickActionButton
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleAddMeal}
          >
            Add Meal
          </QuickActionButton>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
          <QuickActionButton
            variant="outlined"
            color="primary"
            startIcon={<ScaleIcon />}
            onClick={handleLogWeight}
          >
            Log Weight
          </QuickActionButton>
        </Box>
      </Box>

      <AddWorkoutDialog
        open={isAddWorkoutOpen}
        onClose={() => setIsAddWorkoutOpen(false)}
        selectedDate={selectedDate || new Date()}
        onWorkoutAdded={handleWorkoutAdded}
      />

      <AddMealDialog
        open={isAddMealOpen}
        onClose={() => setIsAddMealOpen(false)}
        selectedDate={selectedDate || new Date()}
        onMealAdded={handleMealAdded}
      />

      <AddWeightDialog
        open={isAddWeightOpen}
        onClose={() => setIsAddWeightOpen(false)}
        onWeightAdded={handleWeightAdded}
        selectedDate={selectedDate || new Date()}
      />
    </Box>
  );
};

export default Dashboard; 