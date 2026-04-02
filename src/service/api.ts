import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'https://backend-100-gas-0f3ba29363e5.herokuapp.com/';

// Create an Axios instance
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<any> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor to attach auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        console.warn(`[API Interceptor] No accessToken found for ${config.url}`);
      }
    } catch (error) {
      console.error('Error fetching token from storage:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Explicitly bypass token interception if making auth specific requests
    const isAuthRoute = originalRequest.url?.includes('/v1/auth/request-otp') || 
                        originalRequest.url?.includes('/v1/auth/verify-otp') || 
                        originalRequest.url?.includes('/v1/auth/register') ||
                        originalRequest.url?.includes('/v1/auth/login');

    // Trigger refresh flow if 401 Unauthorized is returned and it wasn't already a retry
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/v1/auth/refresh' && !isAuthRoute) {
      if (isRefreshing) {
        // If a refresh is already in progress, queue the request
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshTokenVal = await AsyncStorage.getItem('refreshToken');
        
        if (!refreshTokenVal) {
           console.warn('[API] Refresh attempt stalled: No refreshToken in storage.');
           return Promise.reject(error);
        }

        // Fix potential double slash and log the attempt
        const refreshUrl = `${baseURL.replace(/\/$/, '')}/v1/auth/refresh`;
        console.log(`[API] Attempting token refresh at: ${refreshUrl}`);

        const refreshRes = await axios.post(refreshUrl, {
          refreshToken: refreshTokenVal
        });

        console.log('[API] Refresh response status:', refreshRes.status);
        
        const newAccessToken = refreshRes.data?.data?.accessToken || refreshRes.data?.accessToken || refreshRes.data?.data?.tokens?.accessToken;
        const newRefreshToken = refreshRes.data?.data?.refreshToken || refreshRes.data?.refreshToken || refreshRes.data?.data?.tokens?.refreshToken;

        if (!newAccessToken) {
          console.error('[API] Refresh failed: No accessToken in response', refreshRes.data);
          throw new Error('No access token returned');
        }

        // Store new tokens
        await AsyncStorage.setItem('accessToken', newAccessToken);
        if (newRefreshToken) {
          await AsyncStorage.setItem('refreshToken', newRefreshToken);
        }

        console.log('[API] Token refresh successful.');

        // Resume other queued requests
        processQueue(null, newAccessToken);
        
        // Execute original request with new token
        originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
        return api(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        
        console.error('[API] Refresh Token flow failed:', refreshError.response?.data || refreshError.message);
        
        // Wipe tokens when totally unauthenticated
        console.log('Refresh Token expired or invalid - forcing logout');
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('userToken');

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
