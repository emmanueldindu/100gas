import api from './api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  categoryId: string;
}

export interface GetProductsResponse {
  success: boolean;
  data: Product[];
  message?: string;
}

export const getProducts = async (categoryId?: string): Promise<GetProductsResponse> => {
  try {
    const response = await api.get('/v1/products', {
      params: categoryId ? { categoryId } : undefined,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Get Products Error:', error.response.data);
      throw error.response.data;
    }
    console.error('Get Products Error:', error.message);
    throw error;
  }
};
export const getCategories = async (): Promise<any> => {
  try {
    const response = await api.get('/v1/products/categories');
    return response.data;
  } catch (error: any) {
    // Gracefully fallback without polluting the console
    return { success: false, data: [] };
  }
};
