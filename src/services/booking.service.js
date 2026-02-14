// src/services/booking.service.js
import api from './api';

export const bookingService = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my'),
  getAllBookings: (params) => api.get('/bookings', { params }),
  updateBookingStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  getBookingById: (id) => api.get(`/bookings/${id}`),
};