import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';

interface Meal {
  id: number;
  userId: number;
  date: string;
  mealType: string;
  time: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description?: string;
  notes?: string;
}

interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const MealTracking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [meals, setMeals] = useState<Meal[]>([]);
  const [dailyTotals, setDailyTotals] = useState<DailyTotals>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newMeal, setNewMeal] = useState<Partial<Meal>>({
    mealType: 'breakfast',
    time: '',
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    description: '',
    notes: '',
  });

  useEffect(() => {
    fetchMeals();
  }, [selectedDate]);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/MealTrackings/daily/${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeals(response.data.meals);
      setDailyTotals(response.data.dailyTotals);
    } catch (err) {
      setError('Failed to fetch meals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/MealTrackings`,
        {
          meal_type: newMeal.mealType,
          meal_time: newMeal.time,
          meal_name: newMeal.name,
          calories: newMeal.calories,
          protein: newMeal.protein,
          carbs: newMeal.carbs,
          fats: newMeal.fat,
          notes: newMeal.notes,
          log_date: selectedDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess('Meal logged successfully');
      setNewMeal({
        mealType: 'breakfast',
        time: '',
        name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        description: '',
        notes: '',
      });
      fetchMeals();
    } catch (err) {
      setError('Failed to log meal');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Meal Tracking
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              type="date"
              label="Select Date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Daily Totals
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                <Typography variant="subtitle2">Calories</Typography>
                <Typography variant="h6">{dailyTotals.calories}</Typography>
              </Box>
              <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                <Typography variant="subtitle2">Protein</Typography>
                <Typography variant="h6">{dailyTotals.protein}g</Typography>
              </Box>
              <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                <Typography variant="subtitle2">Carbs</Typography>
                <Typography variant="h6">{dailyTotals.carbs}g</Typography>
              </Box>
              <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                <Typography variant="subtitle2">Fat</Typography>
                <Typography variant="h6">{dailyTotals.fat}g</Typography>
              </Box>
            </Box>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Meal Type</InputLabel>
                    <Select
                      value={newMeal.mealType}
                      label="Meal Type"
                      onChange={(e) => setNewMeal({ ...newMeal, mealType: e.target.value })}
                    >
                      <MenuItem value="breakfast">Breakfast</MenuItem>
                      <MenuItem value="lunch">Lunch</MenuItem>
                      <MenuItem value="dinner">Dinner</MenuItem>
                      <MenuItem value="snack">Snack</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Time"
                    type="time"
                    value={newMeal.time}
                    onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </Box>

              <Box sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="Meal Name"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  required
                />
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                  <TextField
                    fullWidth
                    label="Calories"
                    type="number"
                    value={newMeal.calories}
                    onChange={(e) => setNewMeal({ ...newMeal, calories: Number(e.target.value) })}
                    required
                  />
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                  <TextField
                    fullWidth
                    label="Protein (g)"
                    type="number"
                    value={newMeal.protein}
                    onChange={(e) => setNewMeal({ ...newMeal, protein: Number(e.target.value) })}
                    required
                  />
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                  <TextField
                    fullWidth
                    label="Carbs (g)"
                    type="number"
                    value={newMeal.carbs}
                    onChange={(e) => setNewMeal({ ...newMeal, carbs: Number(e.target.value) })}
                    required
                  />
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                  <TextField
                    fullWidth
                    label="Fat (g)"
                    type="number"
                    value={newMeal.fat}
                    onChange={(e) => setNewMeal({ ...newMeal, fat: Number(e.target.value) })}
                    required
                  />
                </Box>
              </Box>

              <Box sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  value={newMeal.description}
                  onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
                />
              </Box>

              <Box sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={2}
                  value={newMeal.notes}
                  onChange={(e) => setNewMeal({ ...newMeal, notes: e.target.value })}
                />
              </Box>

              <Box sx={{ width: '100%' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                >
                  Log Meal
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Logged Meals
          </Typography>
          <List>
            {meals.map((meal, index) => (
              <React.Fragment key={meal.id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)} - {meal.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" component="span">
                          Time: {meal.time}
                        </Typography>
                        <br />
                        <Typography variant="body2" component="span">
                          Calories: {meal.calories} | Protein: {meal.protein}g | Carbs: {meal.carbs}g | Fat: {meal.fat}g
                        </Typography>
                        {meal.description && (
                          <>
                            <br />
                            <Typography variant="body2" component="span">
                              Description: {meal.description}
                            </Typography>
                          </>
                        )}
                        {meal.notes && (
                          <>
                            <br />
                            <Typography variant="body2" component="span">
                              Notes: {meal.notes}
                            </Typography>
                          </>
                        )}
                      </>
                    }
                  />
                </ListItem>
                {index < meals.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert onClose={() => setSuccess(null)} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MealTracking; 