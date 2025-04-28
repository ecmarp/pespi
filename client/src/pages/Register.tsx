import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Link, 
  Alert,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    gender: '',
    fitness_goal: '',
    user_height: '',
    is_trainer: 'false'
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Convert string values to appropriate types
      const dataToSubmit = {
        ...formData,
        age: parseInt(formData.age),
        user_height: parseFloat(formData.user_height) / 100, 
        is_trainer: formData.is_trainer === 'true'
      };

      console.log('Sending registration request with data:', dataToSubmit);
      
      const response = await axios.post('http://localhost:5000/api/auth/register', dataToSubmit, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      
      console.log('Registration response:', response.data);

      // Use the login function from AuthContext
      login(response.data.token, response.data.user);

      // Redirect to dashboard
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Create a PespiFitness Account
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '250px' }}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '250px' }}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '250px' }}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '250px' }}>
                <TextField
                  required
                  fullWidth
                  id="age"
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '250px' }}>
                <FormControl fullWidth required>
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    labelId="gender-label"
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    label="Gender"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '250px' }}>
                <TextField
                  required
                  fullWidth
                  id="user_height"
                  label="Height (cm)"
                  name="user_height"
                  type="number"
                  value={formData.user_height}
                  onChange={handleChange}
                  inputProps={{
                    min: 50,
                    max: 300,
                    step: 1
                  }}
                  helperText="Enter your height in centimeters (50-300)"
                />
              </Box>
              <Box sx={{ flex: '1 1 100%', minWidth: '250px' }}>
                <TextField
                  required
                  fullWidth
                  id="fitness_goal"
                  label="Fitness Goal"
                  name="fitness_goal"
                  value={formData.fitness_goal}
                  onChange={handleChange}
                  placeholder="e.g., Weight loss, Muscle gain, Endurance"
                />
              </Box>
              <Box sx={{ flex: '1 1 100%', minWidth: '250px' }}>
                <FormControl fullWidth>
                  <InputLabel id="is_trainer-label">Are you a trainer?</InputLabel>
                  <Select
                    labelId="is_trainer-label"
                    id="is_trainer"
                    name="is_trainer"
                    value={formData.is_trainer}
                    label="Are you a trainer?"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="false">No</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" variant="body2">
                  Login here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 