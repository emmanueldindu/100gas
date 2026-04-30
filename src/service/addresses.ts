import api from './api';

export const updateAddressResult = async (id: string, payload: {
  label: string;
  address: string;
  state: string;
  latitude: number;
  longitude?: number;
  isDefault: boolean;
}) => {
  try {
    const response = await api.patch(`/v1/addresses/${id}`, payload);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Update Address Error:', error.response.data);
      throw error.response.data;
    }
    console.error('Update Address Error:', error.message);
    throw error;
  }
};

export const createAddressResult = async (payload: {
  label: string;
  address: string;
  state: string;
  latitude: number;
  longitude?: number;
  isDefault: boolean;
}) => {
  try {
    const response = await api.post('/v1/addresses', payload);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Create Address Error:', error.response.data);
      throw error.response.data;
    }
    console.error('Create Address Error:', error.message);
    throw error;
  }
};

export const getAddressesResult = async () => {
  try {
    const response = await api.get('/v1/addresses');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Get Addresses Error:', error.response.data);
      throw error.response.data;
    }
    console.error('Get Addresses Error:', error.message);
    throw error;
  }
};
