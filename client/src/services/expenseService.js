import { apiRequest } from '../utils/api';

const API_URL = 'http://localhost:5000/api/expenses';

export const getExpenses = () => {
  return apiRequest(API_URL, 'GET');
};

export const getExpense = (id) => {
  return apiRequest(`${API_URL}/${id}`, 'GET');
};

export const createExpense = (expenseData) => {
  return apiRequest(API_URL, 'POST', expenseData);
};

export const updateExpense = (id, expenseData) => {
  return apiRequest(`${API_URL}/${id}`, 'PUT', expenseData);
};

export const deleteExpense = (id) => {
  return apiRequest(`${API_URL}/${id}`, 'DELETE');
};
