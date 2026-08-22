const mongoose = require('mongoose');

/**
 * Budget Schema
 * 
 * Represents a budget for a specific category and month.
 * Belongs to an authenticated user.
 * Used to track spending against budget limits.
 */
const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Budget must belong to a user'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Food',
        'Transportation',
        'Entertainment',
        'Utilities',
        'Healthcare',
        'Shopping',
        'Education',
        'Travel',
        'Groceries',
        'Dining',
        'Subscriptions',
        'Personal Care',
        'Home & Garden',
        'Other',
      ],
    },
    month: {
      type: String,
      required: [true, 'Month is required'],
      match: [/^\d{4}-\d{2}$/, 'Month must be in format YYYY-MM (e.g., 2026-08)'],
      index: true,
    },
    limit: {
      type: Number,
      required: [true, 'Budget limit is required'],
      validate: {
        validator: (v) => v > 0,
        message: 'Budget limit must be greater than 0',
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Compound index for user + category + month uniqueness.
 * Prevents duplicate budgets for the same user/category/month.
 */
budgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
