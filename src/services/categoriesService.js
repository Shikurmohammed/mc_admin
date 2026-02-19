import apiService from './apiService';
export const categoriesAPI = {

  getCategories: (params = {}) => 
    apiService.get('/categories', { params }),

  // getCategories: () => apiService.get('/categories'),
  getCategory: (categoryId) => apiService.get(`/categories/${categoryId}`),
  createCategory: (categoryData) => apiService.post('/categories', categoryData),
  updateCategory: (categoryId, categoryData) => apiService.patch(`/categories/${categoryId}`, categoryData),
  deleteCategory: (categoryId) => apiService.delete(`/categories/${categoryId}`),

  // Get crafts by category
  getCraftsByCategory: (categoryId, params = {}) => {
    const { page = 1, limit = 10 } = params;
    return apiService.get(`/categories/${categoryId}/crafts?page=${page}&limit=${limit}`);
  },
};