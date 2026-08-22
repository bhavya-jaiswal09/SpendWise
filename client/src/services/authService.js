import { apiRequest } from '../utils/api';

const API_URL = 'http://localhost:5000/api/auth';

export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const setToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const removeToken = () => {
  localStorage.removeItem('authToken');
};

export const register = (userData) => {
  return apiRequest(`${API_URL}/register`, 'POST', userData);
};

export const login = (credentials) => {
  return apiRequest(`${API_URL}/login`, 'POST', credentials);
};

export const logout = () => {
  return apiRequest(`${API_URL}/logout`, 'POST');
};

export const getCurrentUser = () => {
  return apiRequest(`${API_URL}/me`, 'GET');
};
