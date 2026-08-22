const mongoose = require('mongoose');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

/**
 * Helper function to get amount spent for a budget
 * Uses Mongoose aggregation to sum expenses by category and month
 */
const getAmountSpent = async (userId, category, month) => {
  // Parse month to get date range
  const [year, monthStr] = month.split('-');
  const startDate = new Date(`${year}-${monthStr}-01`);
  
  // Calculate end date (last day of month)
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);
  endDate.setDate(0);
  endDate.setHours(23, 59, 59, 999);

  const result = await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        category: category,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ]);

  return result.length > 0 ? result[0].total : 0;
};

/**
 * Helper to format budget response with calculations
 */
const formatBudgetResponse = async (budget) => {
  const amountSpent = await getAmountSpent(budget.user.toString(), budget.category, budget.month);
  const remaining = budget.limit - amountSpent;
  const warningThreshold = budget.limit * 0.8;
  const warning = amountSpent >= warningThreshold;

  return {
    _id: budget._id,
    user: budget.user,
    category: budget.category,
    month: budget.month,
    limit: budget.limit,
    amountSpent: Number(amountSpent.toFixed(2)),
    remaining: Number(remaining.toFixed(2)),
    warning,
    createdAt: budget.createdAt,
    updatedAt: budget.updatedAt,
  };
};

/**
 * Create a new budget
 */
const createBudget = async (req, res, next) => {
  try {
    const { category, month, limit } = req.body;

    // Validate required fields
    if (!category || !month || limit === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Category, month, and limit are required',
      });
    }

    // Validate limit
    if (typeof limit !== 'number' || limit <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be a positive number',
      });
    }

    // Validate month format
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({
        success: false,
        message: 'Month must be in format YYYY-MM (e.g., 2026-08)',
      });
    }

    // Check for existing budget with same category/month
    const existing = await Budget.findOne({
      user: req.user.id,
      category,
      month,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Budget for this category and month already exists',
      });
    }

    // Create budget
    const budget = await Budget.create({
      user: req.user.id,
      category,
      month,
      limit,
    });

    // Format response with calculations
    const formattedBudget = await formatBudgetResponse(budget);

    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      data: {
        budget: formattedBudget,
      },
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    // Handle unique constraint violations
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Budget for this category and month already exists',
      });
    }

    next(error);
  }
};

/**
 * Get all budgets for authenticated user
 */
const getAllBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).sort({ month: -1 });

    // Format each budget with calculations
    const formattedBudgets = await Promise.all(
      budgets.map((budget) => formatBudgetResponse(budget))
    );

    res.status(200).json({
      success: true,
      data: {
        budgets: formattedBudgets,
        count: formattedBudgets.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single budget
 */
const getBudget = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid budget ID format',
      });
    }

    const budget = await Budget.findById(id);

    // Check if budget exists
    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found',
      });
    }

    // Check ownership
    if (budget.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this budget',
      });
    }

    // Format response with calculations
    const formattedBudget = await formatBudgetResponse(budget);

    res.status(200).json({
      success: true,
      data: {
        budget: formattedBudget,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update budget
 */
const updateBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category, month, limit } = req.body;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid budget ID format',
      });
    }

    const budget = await Budget.findById(id);

    // Check if budget exists
    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found',
      });
    }

    // Check ownership
    if (budget.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this budget',
      });
    }

    // Validate limit if provided
    if (limit !== undefined) {
      if (typeof limit !== 'number' || limit <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Limit must be a positive number',
        });
      }
    }

    // Validate month format if provided
    if (month !== undefined && !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({
        success: false,
        message: 'Month must be in format YYYY-MM (e.g., 2026-08)',
      });
    }

    // Update fields
    if (category !== undefined) budget.category = category;
    if (month !== undefined) budget.month = month;
    if (limit !== undefined) budget.limit = limit;

    await budget.save();

    // Format response with calculations
    const formattedBudget = await formatBudgetResponse(budget);

    res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      data: {
        budget: formattedBudget,
      },
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    // Handle unique constraint violations
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Budget for this category and month already exists',
      });
    }

    next(error);
  }
};

/**
 * Delete budget
 */
const deleteBudget = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid budget ID format',
      });
    }

    const budget = await Budget.findById(id);

    // Check if budget exists
    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found',
      });
    }

    // Check ownership
    if (budget.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this budget',
      });
    }

    await Budget.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully',
      data: {
        id,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBudget,
  getAllBudgets,
  getBudget,
  updateBudget,
  deleteBudget,
};
