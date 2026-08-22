import { apiRequest } from '../utils/api';

const API_URL = 'http://localhost:5000/api/budgets';

export const getBudgets = () => {
  return apiRequest(API_URL, 'GET');
};

export const getBudget = (id) => {
  return apiRequest(`${API_URL}/${id}`, 'GET');
};

export const createBudget = (budgetData) => {
  return apiRequest(API_URL, 'POST', budgetData);
};

export const updateBudget = (id, budgetData) => {
  return apiRequest(`${API_URL}/${id}`, 'PUT', budgetData);
};

export const deleteBudget = (id) => {
  return apiRequest(`${API_URL}/${id}`, 'DELETE');
};
