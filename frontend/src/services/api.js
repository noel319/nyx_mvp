import axios from 'axios';

// Create axios instance with base URL
const API_URL = 'http://localhost:5000'; // Changed from HTTPS to HTTP for local development

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies in cross-origin requests
});

// Add interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        success: false,
        error: 'Network error. Please check your connection and try again.'
      });
    }
    
    // Handle specific HTTP status codes
    const status = error.response.status;
    let errorMessage = error.response.data?.message || 'An error occurred';
    
    if (status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // You might want to redirect to login page here
      errorMessage = 'Your session has expired. Please log in again.';
    } else if (status === 403) {
      errorMessage = 'You do not have permission to perform this action.';
    } else if (status === 404) {
      errorMessage = 'The requested resource was not found.';
    } else if (status === 500) {
      errorMessage = 'Server error. Please try again later.';
    }
    
    return Promise.reject({
      success: false,
      error: errorMessage,
      status
    });
  }
);

// Authentication service
const authService = {
  // Register a new user
  signup: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to register user',
      };
    }
  },

  // Login user
  signin: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to authenticate',
      };
    }
  },

  // Verify email with token
  verifyEmail: async (token) => {
    try {
      const response = await api.get(`/auth/verify/${token}`);
      
      // Return the data from the backend without saving to localStorage
      return {
        success: true,
        message: response.data.message || 'Email verified successfully',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to verify email',
      };
    }
  },

  // Resend verification email
  resendVerification: async (email) => {
    try {
      const response = await api.post('/auth/resend', { email });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to resend verification email',
      };
    }
  },

  // Logout user
  signout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }, 
};

export default authService;