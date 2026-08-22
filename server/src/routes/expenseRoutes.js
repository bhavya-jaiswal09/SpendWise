const express = require('express');
const {
  createExpense,
  getAllExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * All expense routes are protected.
 * Users can only access their own expenses.
 */

// POST /api/expenses - Create a new expense
router.post('/', protect, createExpense);

// GET /api/expenses - Get all expenses for authenticated user
router.get('/', protect, getAllExpenses);

// GET /api/expenses/:id - Get a single expense
router.get('/:id', protect, getExpense);

// PUT /api/expenses/:id - Update an expense
router.put('/:id', protect, updateExpense);

// DELETE /api/expenses/:id - Delete an expense
router.delete('/:id', protect, deleteExpense);

module.exports = router;
