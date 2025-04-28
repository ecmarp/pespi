import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { getProfile, updateProfile } from '../services/api';

interface WorkoutGoal {
  desired_weightloss: number;
  desired_protein_intake: number;
  desired_calorie_intake: number;
  desired_sleep: number;
  weekly_exercise: number;
  workout_experience: string;
}

interface AccountSettings {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [workoutGoal, setWorkoutGoal] = useState<WorkoutGoal>({
    desired_weightloss: 0,
    desired_protein_intake: 0,
    desired_calorie_intake: 0,
    desired_sleep: 0,
    weekly_exercise: 0,
    workout_experience: 'beginner',
  });

  const [accountSettings, setAccountSettings] = useState<AccountSettings>({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [currentUserInfo, setCurrentUserInfo] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getProfile();
        console.log('Fetched profile data:', profileData); // Debug log
        
        if (profileData && profileData.name && profileData.email) {
          setCurrentUserInfo({
            name: profileData.name,
            email: profileData.email,
          });
        } else {
          console.error('Profile data is missing name or email:', profileData);
          setError('Failed to load user profile data');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWorkoutGoal(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExperienceChange = (e: SelectChangeEvent) => {
    setWorkoutGoal(prev => ({
      ...prev,
      workout_experience: e.target.value
    }));
  };

  const handleWorkoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to save workout goals
    console.log('Workout goals:', workoutGoal);
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Only include fields that have been changed
      const updateData: any = {};
      if (accountSettings.name) updateData.name = accountSettings.name;
      if (accountSettings.email) updateData.email = accountSettings.email;
      if (accountSettings.currentPassword) {
        updateData.currentPassword = accountSettings.currentPassword;
        if (accountSettings.newPassword) {
          updateData.newPassword = accountSettings.newPassword;
        }
      }

      const updatedProfile = await updateProfile(updateData);
      console.log('Updated profile data:', updatedProfile); // Debug log
      
      // Update the current user info with the new data
      if (updatedProfile && updatedProfile.name && updatedProfile.email) {
        setCurrentUserInfo({
          name: updatedProfile.name,
          email: updatedProfile.email,
        });
      }

      // Clear the form
      setAccountSettings(prev => ({
        ...prev,
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));

      setSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const WorkoutGoalsTab = () => (
    <form onSubmit={handleWorkoutSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 40%', minWidth: '250px' }}>
            <TextField
              fullWidth
              label="Desired Weight Loss (lbs)"
              name="desired_weightloss"
              type="number"
              value={workoutGoal.desired_weightloss}
              onChange={handleInputChange}
            />
          </div>
          
          <div style={{ flex: '1 1 40%', minWidth: '250px' }}>
            <TextField
              fullWidth
              label="Daily Protein Intake (g)"
              name="desired_protein_intake"
              type="number"
              value={workoutGoal.desired_protein_intake}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 40%', minWidth: '250px' }}>
            <TextField
              fullWidth
              label="Daily Calorie Intake"
              name="desired_calorie_intake"
              type="number"
              value={workoutGoal.desired_calorie_intake}
              onChange={handleInputChange}
            />
          </div>
          
          <div style={{ flex: '1 1 40%', minWidth: '250px' }}>
            <TextField
              fullWidth
              label="Desired Sleep (hours)"
              name="desired_sleep"
              type="number"
              value={workoutGoal.desired_sleep}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 40%', minWidth: '250px' }}>
            <TextField
              fullWidth
              label="Weekly Exercise (hours)"
              name="weekly_exercise"
              type="number"
              value={workoutGoal.weekly_exercise}
              onChange={handleInputChange}
            />
          </div>
          
          <div style={{ flex: '1 1 40%', minWidth: '250px' }}>
            <FormControl fullWidth>
              <InputLabel>Workout Experience</InputLabel>
              <Select
                value={workoutGoal.workout_experience}
                label="Workout Experience"
                onChange={handleExperienceChange}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        
        <div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            Save Goals
          </Button>
        </div>
      </div>
    </form>
  );

  const AccountSettingsTab = () => (
    <form onSubmit={handleAccountSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 40%', minWidth: '250px' }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={accountSettings.name}
              onChange={handleAccountChange}
              placeholder={currentUserInfo.name}
              InputProps={{
                sx: {
                  '& input::placeholder': {
                    opacity: 0.5,
                    color: 'text.secondary',
                  },
                },
              }}
              helperText={accountSettings.name ? '' : `Current name: ${currentUserInfo.name}`}
            />
          </div>
          
          <div style={{ flex: '1 1 40%', minWidth: '250px' }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={accountSettings.email}
              onChange={handleAccountChange}
              placeholder={currentUserInfo.email}
              InputProps={{
                sx: {
                  '& input::placeholder': {
                    opacity: 0.5,
                    color: 'text.secondary',
                  },
                },
              }}
              helperText={accountSettings.email ? '' : `Current email: ${currentUserInfo.email}`}
            />
          </div>
        </div>

        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          Change Password
        </Typography>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <TextField
            fullWidth
            label="Current Password"
            name="currentPassword"
            type="password"
            value={accountSettings.currentPassword}
            onChange={handleAccountChange}
          />
          
          <TextField
            fullWidth
            label="New Password"
            name="newPassword"
            type="password"
            value={accountSettings.newPassword}
            onChange={handleAccountChange}
          />
          
          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={accountSettings.confirmPassword}
            onChange={handleAccountChange}
          />
        </div>
        
        <div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            Save Account Settings
          </Button>
        </div>
      </div>
    </form>
  );

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>
        
        <Paper sx={{ p: 3, mt: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
          >
            <Tab label="Workout Goals" />
            <Tab label="Account Settings" />
          </Tabs>

          {activeTab === 0 && <WorkoutGoalsTab />}
          {activeTab === 1 && <AccountSettingsTab />}
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

export default Profile; 