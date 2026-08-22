const Expense = require('../models/Expense');

/**
 * Create a new expense for the authenticated user.
 */
const createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date, paymentMethod, notes } = req.body;

    // Validate required fields
    if (!title || !amount || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, amount, and category are required',
      });
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number',
      });
    }

    // Create expense with authenticated user's ID
    const expense = await Expense.create({
      user: req.user.id, // Use authenticated user ID, not from request body
      title: title.trim(),
      amount,
      category,
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || 'Cash',
      notes: notes ? notes.trim() : undefined,
    });

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: {
        expense,
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

    next(error);
  }
};

/**
 * Get all expenses for the authenticated user.
 * 
 * Only returns expenses belonging to the current user.
 */
const getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: {
        expenses,
        count: expenses.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single expense by ID.
 * 
 * Returns the expense only if it belongs to the authenticated user.
 */
const getExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense ID format',
      });
    }

    const expense = await Expense.findById(id);

    // Check if expense exists
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    // Check ownership: ensure expense belongs to authenticated user
    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this expense',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        expense,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an expense.
 * 
 * Only the owner can update the expense.
 * Ownership cannot be changed (user field is preserved).
 */
const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, amount, category, date, paymentMethod, notes } = req.body;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense ID format',
      });
    }

    const expense = await Expense.findById(id);

    // Check if expense exists
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    // Check ownership
    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this expense',
      });
    }

    // Validate amount if provided
    if (amount !== undefined) {
      if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be a positive number',
        });
      }
    }

    // Update allowed fields (never allow changing user ownership)
    if (title !== undefined) expense.title = title.trim();
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;
    if (date !== undefined) expense.date = new Date(date);
    if (paymentMethod !== undefined) expense.paymentMethod = paymentMethod;
    if (notes !== undefined) expense.notes = notes.trim();

    await expense.save();

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: {
        expense,
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

    next(error);
  }
};

/**
 * Delete an expense.
 * 
 * Only the owner can delete the expense.
 */
const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense ID format',
      });
    }

    const expense = await Expense.findById(id);

    // Check if expense exists
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    // Check ownership
    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this expense',
      });
    }

    await Expense.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: {
        id,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getAllExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
};
