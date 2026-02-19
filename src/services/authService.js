import apiService from './apiService';


export const authAPI = {
  login: (credentials) => apiService.post('/auth/login', credentials),

  register: (userData) => apiService.post('/auth/register', userData),
  
  refreshTokens: (data) => apiService.post('/auth/refresh', data),

  logout: (userId) => apiService.post('/auth/logout', { userId }),

  getProfile: () => apiService.get('/auth/profile'),
};


