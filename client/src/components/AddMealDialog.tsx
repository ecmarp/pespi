import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface AddMealDialogProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date;
  onMealAdded: (mealDetails: any) => void;
}

const AddMealDialog: React.FC<AddMealDialogProps> = ({
  open,
  onClose,
  selectedDate,
  onMealAdded,
}) => {
  const { token } = useAuth();
  const [mealType, setMealType] = useState('breakfast');
  const [mealTime, setMealTime] = useState('');
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!token) {
      setError('You must be logged in to log a meal');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/meals/log`,
        {
          type: mealType,
          time: mealTime,
          name: mealName,
          calories: parseFloat(calories),
          protein: parseFloat(protein),
          carbs: parseFloat(carbs),
          fat: parseFloat(fat),
          notes: notes,
          log_date: selectedDate.toISOString().split('T')[0],
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess('Meal logged successfully');
      onMealAdded(response.data.mealLog);
      
      // Reset form
      setMealType('breakfast');
      setMealTime('');
      setMealName('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFat('');
      setNotes('');
      
      // Close dialog after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error logging meal:', err);
      setError('Failed to log meal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Log a Meal</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Meal Type</InputLabel>
              <Select
                value={mealType}
                label="Meal Type"
                onChange={(e: SelectChangeEvent) => setMealType(e.target.value)}
              >
                <MenuItem value="breakfast">Breakfast</MenuItem>
                <MenuItem value="lunch">Lunch</MenuItem>
                <MenuItem value="dinner">Dinner</MenuItem>
                <MenuItem value="snack">Snack</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Time"
              type="time"
              value={mealTime}
              onChange={(e) => setMealTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
            />
            
            <TextField
              label="Meal Name"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              required
            />
            
            <TextField
              label="Calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
            />
            
            <TextField
              label="Protein (g)"
              type="number"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              required
            />
            
            <TextField
              label="Carbs (g)"
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              required
            />
            
            <TextField
              label="Fat (g)"
              type="number"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              required
            />
            
            <TextField
              label="Notes (optional)"
              multiline
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Logging...' : 'Log Meal'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddMealDialog; 