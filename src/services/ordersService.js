


import apiService from './apiService';
export const ordersAPI = {
  createOrder: (orderData) =>
    apiService.post('/orders', orderData),

  getOrders: (params = {}) => {
    const { status, page = 1, limit = 10 } = params;
    return apiService.get('/orders', {
      params: { status, page, limit },
    });
  },

  getUserOrders: (page = 1, limit = 10) =>
    apiService.get('/orders/my-orders', {
      params: { page, limit },
    }),

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
