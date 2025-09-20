import axios from 'axios';

const API_BASE_URL = '/api';

// Configuración base de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Servicios de autenticación
export const authService = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData) => 
    api.post('/auth/register', userData)
};

// Servicios de alojamientos
export const accommodationService = {
  getAll: () => api.get('/accommodations'),
  
  getById: (id) => api.get(`/accommodations/${id}`),
  
  create: (accommodationData) => 
    api.post('/accommodations', accommodationData),
  
  update: (id, accommodationData) => 
    api.put('/accommodations', { id, ...accommodationData }),
  
  delete: (id) => 
    api.delete('/accommodations', { data: { id } })
};

// Servicios de favoritos
export const favoriteService = {
  getByUser: (userId) => 
    api.get(`/favorites/user/${userId}`),
  
  add: (userId, accommodationId) => 
    api.post('/favorites', { user_id: userId, accommodation_id: accommodationId }),
  
  remove: (userId, accommodationId) => 
    api.delete('/favorites', { data: { user_id: userId, accommodation_id: accommodationId } })
};

export default api;