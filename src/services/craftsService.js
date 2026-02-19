
import apiService from './apiService';
export const craftsAPI = {
  getCrafts: (params = {}) => apiService.get('/crafts', { params }),
  getCraft: (craftId) => apiService.get(`/crafts/${craftId}`),
  // createCraft: (craftData) => apiService.post('/crafts', craftData),

  createCraft: (data) => {
    if (data instanceof FormData) {
      return apiService.post('/crafts', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: [(data) => data],
      });
    }
    return apiService.post('/crafts', data);
  },

  updateCraft: (craftId, craftData) => apiService.patch(`/crafts/${craftId}`, craftData),
  deleteCraft: (craftId) => apiService.delete(`/crafts/${craftId}`),
  getArtisanCrafts: (artisanId) => apiService.get(`/crafts/artisan/${artisanId}`),
  // getCraftCategories: () => apiService.get('/categories'), // return list of categories
  getCraftCategories: () => apiService.get('/categories').then(res => res.data),

  getStats: () =>
    apiService.get('/crafts/stats'),

  getFeaturedCrafts: (params = {}) =>
    apiService.get('/crafts/featured', { params }),
};


