import apiService from './apiService';

export const craftsAPI = {
  // Queries
  getCrafts: (params = {}) => apiService.get('/crafts', { params }),
  
  getCraft: (craftId) => apiService.get(`/crafts/${craftId}`),
  
  getCraftCategories: () => apiService.get('/categories'), 
  
  getFeaturedCrafts: (params = {}) => apiService.get('/crafts/featured', { params }),

  // ADD THIS BACK: Artisan specific crafts
  getArtisanCrafts: (artisanId) => apiService.get(`/crafts/artisan/${artisanId}`),
  getStats: () => apiService.get('/crafts/stats'),

  // Mutations
  createCraft: (data) => {
    const isFormData = data instanceof FormData;
    return apiService.post('/crafts', data, {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      },
    });
  },

  updateCraft: (craftId, data) => {
    const isFormData = data instanceof FormData;
    return apiService.patch(`/crafts/${craftId}`, data, {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      },
    });
  },

  deleteCraft: (craftId) => apiService.delete(`/crafts/${craftId}`),
    updateCraftStock: (craftId, stock) => 
    apiService.patch(`/crafts/${craftId}/stock`, { stock }),


};
