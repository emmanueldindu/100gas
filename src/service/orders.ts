import api from './api';

export interface OrderItem {
  productId?: string;
  cylinderSize: string; // e.g. 'KG_3', 'KG_5', 'KG_6', 'KG_10', 'KG_12_5'
  isRefill: boolean;
  quantity: number;
}

export interface CreateOrderPayload {
  addressId: string;
  items: OrderItem[];
  paymentMethod: string; // 'CARD' or 'CASH'
  scheduledDate: string; // ISO String
  promoCode?: string;
  userNotes?: string;
}

export const createOrder = async (payload: CreateOrderPayload) => {
  try {
    const response = await api.post('/v1/orders', payload);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Create Order Error:', error.response.data);
      throw error.response.data;
    }
    console.error('Create Order Error:', error.message);
    throw error;
  }
};

export interface PricingRatesResponse {
  success: boolean;
  data: {
    pricePerKg: number;
    deliveryFee: number;
  };
}

export const getPricingRates = async (): Promise<PricingRatesResponse> => {
  try {
    const response = await api.get('/v1/orders/rates');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Get Pricing Rates Error:', error.response.data);
      throw error.response.data;
    }
    console.error('Get Pricing Rates Error:', error.message);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await api.get('/v1/orders');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Get Orders Error:', error.response.data);
      throw error.response.data;
    }
    console.error('Get Orders Error:', error.message);
    throw error;
  }
};
