import apiService from './apiService';

export const authAPI = {
  login: (credentials) => apiService.post('/auth/login', credentials),

  register: (userData) => apiService.post('/auth/register', userData),

  refreshTokens: () => apiService.post('/auth/refresh', {}), // Empty body - token in cookie

  logout: () => apiService.post('/auth/logout', {}), // Empty body - token in cookie

  getProfile: () => apiService.get('/auth/profile'),

  checkAuth: () => apiService.get('/auth/check'),

  forgotPassword: (data) => apiService.post('/auth/forgot-password', data),

  resetPassword: (data) => apiService.post('/auth/reset-password', data),

  validateResetToken: (token) => apiService.get(`/auth/validate-reset-token/${token}`),
};
