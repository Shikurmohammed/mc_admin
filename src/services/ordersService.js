import apiService from './apiService';

export const ordersAPI = {
  createOrder: (orderData) =>
    apiService.post('/orders', orderData),

  getOrders: (params = {}) => {
    // Destructure params to ensure they are passed correctly
    const { status, page = 1, limit = 10, ...rest } = params;
    return apiService.get('/orders', {
      params: { status, page, limit, ...rest },
    });
  },

  // ADD THIS FUNCTION:
  getArtisanOrders: (params = {}) => 
    apiService.get('/orders/artisan', { params }),

  getUserOrders: (params = {}) => {
    // Updated to accept an object for consistency with your fetchOrders logic
    const { page = 1, limit = 10, ...rest } = params;
    return apiService.get('/orders/my-orders', {
      params: { page, limit, ...rest },
    });
  },

  getOrder: (orderId) =>
    apiService.get(`/orders/${orderId}`),

  updateOrder: (orderId, orderData) =>
    apiService.patch(`/orders/${orderId}`, orderData),

  deleteOrder: (orderId) =>
    apiService.delete(`/orders/${orderId}`),

  updateOrderStatus: (orderId, status) =>
    apiService.patch(`/orders/${orderId}/status`, { status }),

  addTrackingNumber: (orderId, trackingNumber) =>
    apiService.patch(`/orders/${orderId}/tracking`, { trackingNumber }),

  getOrderStatistics: () =>
    apiService.get('/orders/statistics'),
};
