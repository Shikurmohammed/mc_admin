import apiService from "./apiService";
export const userAPI = {

  getUsers: (params = {}) => apiService.get('/users', { params }),
  
  getUser: (userId) =>
    apiService.get(`/users/${userId}`),

  createUser: (userData) =>
    apiService.post('/users', userData),

  updateUser: (userId, userData) =>
    apiService.patch(`/users/${userId}`, userData),

  deleteUser: (userId) =>
    apiService.delete(`/users/${userId}`),
};