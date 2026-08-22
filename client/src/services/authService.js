const API_URL = 'http://localhost:5000/api/auth';

/**
 * Token Management
 */

export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const setToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const removeToken = () => {
  localStorage.removeItem('authToken');
};

/**
 * API Request Helper
 */
const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add token to Authorization header if it exists
  const token = getToken();
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw { response: { status: response.status, data } };
  }

  return { status: response.status, data };
};

/**
 * Authentication API Methods
 */

export const register = (userData) => {
  return apiRequest('/register', 'POST', userData);
};

export const login = (credentials) => {
  return apiRequest('/login', 'POST', credentials);
};

export const logout = () => {
  return apiRequest('/logout', 'POST');
};

export const getCurrentUser = () => {
  return apiRequest('/me', 'GET');
};
