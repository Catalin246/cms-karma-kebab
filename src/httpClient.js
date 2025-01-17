// api/httpClient.js
import axios from 'axios';
import keycloakService from './keycloak';

// Create axios instance with default config
const httpClient = axios.create({
  // Add your base API URL here
  baseURL: import.meta.env.VITE_APP_API_GATEWAY,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
httpClient.interceptors.request.use(
  async config => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('Token:', token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error getting token:', error);
      return Promise.reject(error);
    }
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
httpClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        await window.keycloak.updateToken(70);
        
        // Get new token and retry request
        const token = ocalStorage.getItem('access_token');
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default httpClient;