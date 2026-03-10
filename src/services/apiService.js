import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const apiService = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true, // Automatically sends/receives HttpOnly cookies
});

apiService.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // --- ADD THIS SECTION FOR NETWORK ERRORS ---
    if (!error.response) {
      // Create a real Error instance instead of a plain object
      const networkError = new Error("Server is unreachable. Please check if the backend is running.");
      networkError.isNetworkError = true;
      return Promise.reject(networkError);
    }

    // 1. Identify which URL failed
    const isLogin = originalRequest.url.includes('/auth/login');
    const isRefresh = originalRequest.url.includes('/auth/refresh');

    // 2. If Login fails with 401, DO NOT RETRY. 
    // Just throw the error back to the LoginPage so it can show "Invalid Credentials".
    if (isLogin) {
      return Promise.reject(error);
    }

    // 3. If it's a 401 on any OTHER protected route, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry && !isRefresh) {
      originalRequest._retry = true;

      try {
        await apiService.post('/auth/refresh');
        return apiService(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear state and go to login
        localStorage.removeItem('user');
        if (window.location.pathname.startsWith('/dashboard')) {
          window.location.replace('/login');
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);



export const dashboardAPI = {
  // Admin dashboard stats
  getAdminStats: () => apiService.get('/dashboard/admin/stats'),

  // Artisan dashboard stats
  getArtisanStats: (artisanId) => apiService.get(`/dashboard/artisan/${artisanId}/stats`),

  // Customer dashboard stats
  getCustomerStats: (customerId) => apiService.get(`/dashboard/customer/${customerId}/stats`),

  // Sales analytics
  getSalesAnalytics: (period = 'monthly') => apiService.get(`/dashboard/sales-analytics?period=${period}`),

  // Popular crafts analytics
  getPopularCraftsAnalytics: (limit = 10) => apiService.get(`/dashboard/popular-crafts?limit=${limit}`),

  // Revenue analytics
  getRevenueAnalytics: (startDate, endDate) =>
    apiService.get(`/dashboard/revenue-analytics?startDate=${startDate}&endDate=${endDate}`),

  // User activity
  getUserActivity: (limit = 20) => apiService.get(`/dashboard/user-activity?limit=${limit}`),

  // Recent orders
  getRecentOrders: (limit = 10) => apiService.get(`/dashboard/recent-orders?limit=${limit}`),

  // Top artisans
  getTopArtisans: (limit = 10) => apiService.get(`/dashboard/top-artisans?limit=${limit}`),

  // Category distribution
  getCategoryDistribution: () => apiService.get('/dashboard/category-distribution'),
};

export const searchAPI = {
  // Global search
  globalSearch: (query) => apiService.get(`/search?q=${encodeURIComponent(query)}`),

  // Autocomplete suggestions
  autocomplete: (query) => apiService.get(`/search/autocomplete?q=${encodeURIComponent(query)}`),

  // Advanced search
  advancedSearch: (criteria) => apiService.post('/search/advanced', criteria),

  // Search history
  getSearchHistory: () => apiService.get('/search/history'),
  clearSearchHistory: () => apiService.delete('/search/history'),
};

export const analyticsAPI = {
  // Website analytics
  getWebsiteAnalytics: (startDate, endDate) =>
    apiService.get(`/analytics/website?startDate=${startDate}&endDate=${endDate}`),

  // Craft analytics
  getCraftAnalytics: (craftId, startDate, endDate) =>
    apiService.get(`/analytics/craft/${craftId}?startDate=${startDate}&endDate=${endDate}`),

  // User analytics
  getUserAnalytics: (startDate, endDate) =>
    apiService.get(`/analytics/users?startDate=${startDate}&endDate=${endDate}`),

  // Sales funnel
  getSalesFunnel: () => apiService.get('/analytics/sales-funnel'),

  // Conversion rates
  getConversionRates: () => apiService.get('/analytics/conversion-rates'),
};

export const exportAPI = {
  exportData: (type, data, options = {}) => {
    const headers = {
      'Content-Type': type === 'excel'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : type === 'pdf'
          ? 'application/pdf'
          : 'application/json',
    };

    return apiService.post('/export', { type, data, options }, {
      headers,
      responseType: type === 'excel' || type === 'pdf' ? 'blob' : 'json',
    });
  },
};

export const calendarAPI = {
  getEvents: () => apiService.get('/calendar'),

  getEvent: (id) =>
    apiService.get(`/calendar/${id}`),

  createEvent: (data) =>
    apiService.post('/calendar', data),

  updateEvent: (id, data) =>
    apiService.patch(`/calendar/${id}`, data),

  deleteEvent: (id) =>
    apiService.delete(`/calendar/${id}`),
};


export default apiService;