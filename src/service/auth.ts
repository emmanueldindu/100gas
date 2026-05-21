import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const requestOtp = async (phone: string) => {
  try {
    const response = await api.post('/v1/auth/request-otp', { phone });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Request OTP Error:', error.response.data);
      throw error.response.data;
    }
    console.error('Request OTP Error:', error.message);
    throw error;
  }
};

export const verifyOtp = async (phone: string, otp: string) => {
  try {
    const response = await api.post('/v1/auth/verify-otp', { phone, otp });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Verify OTP Error:', error.response.data);
      throw error.response.data;
    }
    console.error('Verify OTP Error:', error.message);
    throw error;
  }
};

export const registerUser = async (payload: any) => {
  try {
    const response = await api.post('/v1/auth/register', payload);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Register Error:', error.response.data);
      throw error.response.data;
    }
    console.error('Register Error:', error.message);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/v1/auth/me');
    if (response.data?.success && response.data?.data) {
      await AsyncStorage.setItem('cachedProfile', JSON.stringify(response.data.data));
    }
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Get Profile Error:', error.response.data);
      throw error.response.data;
    }
    console.error('Get Profile Error:', error.message);
    throw error;
  }
};
export const updateProfile = async (payload: any) => {
  try {
    const response = await api.patch('/v1/auth/me', payload);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Update Profile Error:', error.response.data);
      throw error.response.data;
    }
    console.error('Update Profile Error:', error.message);
    throw error;
  }
};

export const deleteAccount = async () => {
  try {
    const response = await api.delete('/v1/auth/me');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Delete Account Error:', error.response.data);
      throw error.response.data;
    }
    console.error('Delete Account Error:', error.message);
    throw error;
  }
};
