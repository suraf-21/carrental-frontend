import api from './api';

export const contactService = {
  submitContact: (data) => api.post('/contact', data),
  getMessages: (params) => api.get('/contact', { params }),
  updateMessageStatus: (id, status) => api.patch(`/contact/${id}/status`, { status }),
};