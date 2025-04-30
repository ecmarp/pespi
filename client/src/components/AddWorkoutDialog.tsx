import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Checkbox,
  Divider,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItemButton,
  TextField,
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  FitnessCenter as WorkoutIcon,
  Add as AddIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Define options for sets and reps
const SET_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);
const REP_OPTIONS = Array.from({ length: 20 }, (_, i) => i + 1);

interface WorkoutTemplate {
  workout_id: number;
  exercise_name: string;
  exercise_type: string;
  default_calories: number;
  muscle_group: string;
  description: string;
}

interface WorkoutDetails {
  sets: number;
  reps: number;
  totalCalories: number;
  user_workout_id?: number; // Optional since it will be populated after API response
}

interface SelectedWorkout extends WorkoutTemplate {
  details: WorkoutDetails;
}

interface AddWorkoutDialogProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date;
  onWorkoutAdded: (workoutDetails: { date: string; totalCalories: number; workouts: { id: number; name: string; sets: number; reps: number; caloriesBurned: number }[] }) => void;
}

const AddWorkoutDialog: React.FC<AddWorkoutDialogProps> = ({
  open,
  onClose,
  selectedDate,
  onWorkoutAdded,
}) => {
  const { token } = useAuth();
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkouts, setSelectedWorkouts] = useState<Map<number, WorkoutDetails>>(new Map());
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutTemplate | null>(null);
  const [tempDetails, setTempDetails] = useState<WorkoutDetails>({ sets: 1, reps: 1, totalCalories: 0 });
  const [totalDuration, setTotalDuration] = useState<string>('30');

  const fetchWorkoutTemplates = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Making API request to:', `${API_BASE_URL}/workouts/templates`);
      
      const response = await axios.get(`${API_BASE_URL}/workouts/templates`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('API Response:', response.data);
      
      if (response.data && response.data.templates) {
        console.log('Setting workout templates:', response.data.templates);
        setWorkoutTemplates(response.data.templates);
      } else {
        console.error('Invalid response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching workout templates:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch workout templates when dialog opens
  useEffect(() => {
    if (open && token) {
      console.log('Dialog opened, fetching templates...');
      fetchWorkoutTemplates();
    }
  }, [open, token, fetchWorkoutTemplates]);

  const handleWorkoutToggle = (workout: WorkoutTemplate) => {
    if (selectedWorkouts.has(workout.workout_id)) {
      const newSelected = new Map(selectedWorkouts);
      newSelected.delete(workout.workout_id);
      setSelectedWorkouts(newSelected);
    } else {
      setCurrentWorkout(workout);
      const initialTotalCalories = 1 * 1 * workout.default_calories;
      setTempDetails({ sets: 1, reps: 1, totalCalories: initialTotalCalories });
      setDetailDialogOpen(true);
    }
  };

  const handleDetailsSave = () => {
    if (currentWorkout) {
      const totalCalories = tempDetails.sets * tempDetails.reps * currentWorkout.default_calories;
      const newDetails = { ...tempDetails, totalCalories };
      const newSelected = new Map(selectedWorkouts);
      newSelected.set(currentWorkout.workout_id, newDetails);
      setSelectedWorkouts(newSelected);
      setDetailDialogOpen(false);
      setCurrentWorkout(null);
    }
  };

  const handleDetailsCancel = () => {
    setDetailDialogOpen(false);
    setCurrentWorkout(null);
  };

  const handleAddWorkouts = async () => {
    try {
      // Ensure we have a valid duration before submitting
      const duration = parseInt(totalDuration);
      if (isNaN(duration) || duration <= 0) {
        alert('Please enter a valid workout duration');
        return;
      }

      // Create workouts sequentially to ensure unique IDs
      const mappedWorkouts = [];
      const workoutEntries = Array.from(selectedWorkouts.entries());
      console.log('Creating workouts for entries:', workoutEntries);

      for (const [workoutId, details] of workoutEntries) {
        const workout = workoutTemplates.find(w => w.workout_id === workoutId);
        if (!workout) continue;

        try {
          console.log('Creating workout:', {
            workout_id: workout.workout_id,
            exercise_name: workout.exercise_name,
            sets: details.sets,
            reps: details.reps
          });

          const response = await axios.post(
            `${API_BASE_URL}/workouts/log`,
            {
              workout_id: workout.workout_id,
              sets: details.sets,
              reps: details.reps,
              calories_burned: details.totalCalories,
              duration_min: duration,
              workout_date: selectedDate.toISOString().split('T')[0],
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          console.log('Workout creation response:', response.data);

          if (response.data && response.data.workoutLog) {
            const workoutToAdd = {
              id: response.data.workoutLog.user_workout_id,
              name: workout.exercise_name,
              sets: details.sets,
              reps: details.reps,
              caloriesBurned: details.totalCalories,
            };
            console.log('Adding workout to mapped workouts:', workoutToAdd);
            mappedWorkouts.push(workoutToAdd);
          } else {
            console.error('Invalid response format:', response.data);
          }
        } catch (error) {
          console.error('Error adding workout:', error);
          // Continue with other workouts even if one fails
        }
      }

      console.log('Final mapped workouts:', mappedWorkouts);

      // Calculate total calories
      const totalCalories = mappedWorkouts.reduce(
        (sum, workout) => sum + workout.caloriesBurned,
        0
      );

      // Update the calendar data
      const dateKey = selectedDate.toISOString().split('T')[0];
      onWorkoutAdded({
        date: dateKey,
        totalCalories,
        workouts: mappedWorkouts,
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding workouts:', error);
    }
  };

  // Group workouts by muscle group
  const workoutsByMuscleGroup = workoutTemplates.reduce((acc, workout) => {
    const group = workout.muscle_group;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(workout);
    return acc;
  }, {} as Record<string, WorkoutTemplate[]>);

  // Update input validation for duration to handle empty values
  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setTotalDuration(value);
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Add Workouts for {selectedDate.toLocaleDateString()}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box sx={{ width: '100%' }}>
                {Object.entries(workoutsByMuscleGroup).map(([group, workouts]) => (
                  <Accordion key={group} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">{group}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {workouts.map((workout) => {
                          const details = selectedWorkouts.get(workout.workout_id);
                          return (
                            <ListItemButton
                              key={workout.workout_id}
                              dense
                              onClick={() => handleWorkoutToggle(workout)}
                            >
                              <ListItemIcon>
                                <Checkbox
                                  edge="start"
                                  checked={selectedWorkouts.has(workout.workout_id)}
                                  tabIndex={-1}
                                  disableRipple
                                />
                              </ListItemIcon>
                              <ListItemText 
                                primary={workout.exercise_name}
                                secondary={
                                  details
                                    ? `${details.sets} sets × ${details.reps} reps • ${details.totalCalories} calories`
                                    : `${workout.default_calories} calories per rep`
                                }
                              />
                            </ListItemButton>
                          );
                        })}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
              {selectedWorkouts.size > 0 && (
                <Box sx={{ mt: 2, p: 2 }}>
                  <FormControl fullWidth margin="normal">
                    <TextField
                      label="Total Workout Duration (minutes)"
                      type="text"
                      value={totalDuration}
                      onChange={handleDurationChange}
                      inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*'
                      }}
                      helperText="Enter the total time spent working out in minutes"
                    />
                  </FormControl>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAddWorkouts}
            startIcon={<AddIcon />}
            disabled={selectedWorkouts.size === 0}
          >
            Add Selected Workouts
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={detailDialogOpen} onClose={handleDetailsCancel}>
        <DialogTitle>
          Set Workout Details
          {currentWorkout && ` - ${currentWorkout.exercise_name}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select the number of sets and reps for this workout:
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Sets</InputLabel>
              <Select
                value={tempDetails.sets}
                label="Sets"
                onChange={(e) => {
                  const newSets = e.target.value as number;
                  const newTotalCalories = newSets * tempDetails.reps * (currentWorkout?.default_calories || 0);
                  setTempDetails({
                    ...tempDetails,
                    sets: newSets,
                    totalCalories: newTotalCalories
                  });
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300
                    }
                  }
                }}
              >
                {SET_OPTIONS.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Reps per Set</InputLabel>
              <Select
                value={tempDetails.reps}
                label="Reps per Set"
                onChange={(e) => {
                  const newReps = e.target.value as number;
                  const newTotalCalories = tempDetails.sets * newReps * (currentWorkout?.default_calories || 0);
                  setTempDetails({
                    ...tempDetails,
                    reps: newReps,
                    totalCalories: newTotalCalories
                  });
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300
                    }
                  }
                }}
              >
                {REP_OPTIONS.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {currentWorkout && (
              <Typography sx={{ mt: 2 }}>
                Total Calories: {tempDetails.sets * tempDetails.reps * currentWorkout.default_calories}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailsCancel}>Cancel</Button>
          <Button onClick={handleDetailsSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddWorkoutDialog; 