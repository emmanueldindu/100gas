import api from './api';

export const getStatesResult = async () => {
  try {
    const response = await api.get('/v1/locations/states');
    return response.data; // { success: true, data: [...] }
  } catch (error: any) {
    if (error.response) {
      console.error('Get States Error:', error.response.data);
      throw error.response.data;
    }
    console.error('Get States Error:', error.message);
    throw error;
  }
};
