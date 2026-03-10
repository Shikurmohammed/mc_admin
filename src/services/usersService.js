import apiService from "./apiService";
export const usersAPI = {

  // Use this for Admin Management (Full access)
  getUsers: (params = {}) => apiService.get('/users', { params }),

  // Use this for the Messaging Page (Limited public info)
  getContacts: (params = {}) => apiService.get('/users/contacts', { params }),


  getUser: (userId) =>
    apiService.get(`/users/${userId}`),

  createUser: (userData) =>
    apiService.post('/users', userData),

  updateUser: (userId, userData) =>
    apiService.patch(`/users/${userId}`, userData),

  deleteUser: (userId) =>
    apiService.delete(`/users/${userId}`),



  // Profile
  updateProfile: (profileData) =>
    apiService.patch('/users/profile', profileData),

  uploadAvatar: (formData) =>
    apiService.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Settings
  updateNotificationSettings: (settings) =>
    apiService.patch('/users/notifications', settings),

  updateSecuritySettings: (settings) =>
    apiService.patch('/users/security', settings),

  updateAppearanceSettings: (settings) =>
    apiService.patch('/users/appearance', settings),

  updatePreferences: (preferences) =>
    apiService.patch('/users/preferences', preferences),

  // Security
  changePassword: (data) =>
    apiService.post('/users/change-password', data),

  getLoginHistory: () =>
    apiService.get('/users/login-history'),

  logoutAllDevices: () =>
    apiService.post('/users/logout-all'),

  deleteAccount: () =>
    apiService.delete('/users/account'),

  // Get all settings at once
  getUserSettings: () =>
    apiService.get('/users/settings'),
  //Get Team Members
  getTeamMembers: (params = {}) =>
    apiService.get('/users/team-members', { params }),
};