import api from './api';

export interface Cylinder {
  id: string;
  qrCodeId: string;
  size: string;
  householdSize: number;
  cookingFrequency: string;
  initialStatus: string;
  lastFilledAt: string;
  predictedEmptyDate: string;
  currentPercentage: number;
  averageDaysPerFill: number;
  totalRefills: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetCylindersResponse {
  success: boolean;
  data: Cylinder[];
  message?: string;
}

export const getUserCylinders = async (): Promise<GetCylindersResponse> => {
  try {
    const response = await api.get('/v1/cylinders');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Get User Cylinders Error:', error.response.data);
      throw error.response.data;
    }
    console.error('Get User Cylinders Error:', error.message);
    throw error;
  }
};
