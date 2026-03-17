import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Public API ─────────────────────────────────────────────

export const getDisasters = () => api.get('/disasters');
export const getDisaster = (id) => api.get(`/disasters/${id}`);
export const getFacilities = (params) => api.get('/facilities', { params });
export const getAlerts = (params) => api.get('/alerts', { params });

// ─── Admin API ──────────────────────────────────────────────

export const adminLogin = (credentials) => api.post('/admin/login', credentials);

export const createDisaster = (data) => api.post('/admin/disasters', data);
export const updateDisaster = (id, data) => api.put(`/admin/disasters/${id}`, data);
export const deleteDisaster = (id) => api.delete(`/admin/disasters/${id}`);

export const createFacility = (data) => api.post('/admin/facilities', data);
export const updateFacility = (id, data) => api.put(`/admin/facilities/${id}`, data);
export const deleteFacility = (id) => api.delete(`/admin/facilities/${id}`);

export const createAlert = (data) => api.post('/admin/alerts', data);
export const updateAlert = (id, data) => api.put(`/admin/alerts/${id}`, data);
export const deleteAlert = (id) => api.delete(`/admin/alerts/${id}`);

export const uploadFacilities = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/admin/upload/facilities', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const uploadAlerts = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/admin/upload/alerts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default api;
