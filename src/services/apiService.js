import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const apiService = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased to 30s for production analytics/reports
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Keep this for cookies
});

// Request interceptor - ONLY for access token from localStorage
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiService.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const isLoginRequest = originalRequest.url?.includes('/auth/login');
    
    if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest) {
      originalRequest._retry = true;

      try {
        // DON'T get refresh token from localStorage - rely on HTTP-only cookie
        // Just get user ID from localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) throw new Error('No user data');
        
        const user = JSON.parse(userStr);
        
        // Send only userId - refresh token is in cookie automatically
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { userId: user.id }, // Don't send refresh token in body
          { withCredentials: true }
        );

        const { access_token, refresh_token } = refreshResponse.data;
        
        // Update localStorage with new tokens
        localStorage.setItem('access_token', access_token);
        if (refresh_token) {
          localStorage.setItem('refresh_token', refresh_token);
        }

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiService(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear everything
        localStorage.clear();
        window.location.href = '/login';
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