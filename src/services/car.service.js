// src/services/car.service.js
import api from './api';

export const carService = {
  getCars: (params) => api.get('/cars', { params }),
  getCarById: (id) => api.get(`/cars/${id}`),
  createCar: (data) => api.post('/cars', data),
  updateCar: (id, data) => api.put(`/cars/${id}`, data),
  deleteCar: (id) => api.delete(`/cars/${id}`),
  updateStatus: (id, status) => api.patch(`/cars/${id}/status`, { status }),
};