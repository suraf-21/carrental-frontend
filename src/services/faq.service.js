import api from './api';

export const faqService = {
  getFAQs: (params) => api.get('/faq', { params }),
  createFAQ: (data) => api.post('/faq', data),
  updateFAQ: (id, data) => api.put(`/faq/${id}`, data),
  deleteFAQ: (id) => api.delete(`/faq/${id}`),
};