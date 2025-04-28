import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface ProfileData {
  name: string;
  email: string;
  height: number;
  weight: number;
  totalWorkouts: number;
  averageDailyCalories: number;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const getProfile = async (): Promise<ProfileData> => {
  const response = await axios.get(`${API_BASE_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

export const updateProfile = async (data: UpdateProfileData): Promise<ProfileData> => {
  const response = await axios.put(`${API_BASE_URL}/profile`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
}; 