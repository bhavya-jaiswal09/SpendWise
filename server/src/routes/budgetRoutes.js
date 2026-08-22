const express = require('express');
const {
  createBudget,
  getAllBudgets,
  getBudget,
  updateBudget,
  deleteBudget,
} = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * All budget routes are protected.
 * Users can only access and modify their own budgets.
 */

// POST /api/budgets - Create a new budget
router.post('/', protect, createBudget);

// GET /api/budgets - Get all budgets for authenticated user
router.get('/', protect, getAllBudgets);

// GET /api/budgets/:id - Get a single budget
router.get('/:id', protect, getBudget);

// PUT /api/budgets/:id - Update a budget
router.put('/:id', protect, updateBudget);

// DELETE /api/budgets/:id - Delete a budget
router.delete('/:id', protect, deleteBudget);

module.exports = router;
