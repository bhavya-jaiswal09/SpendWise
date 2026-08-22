const mongoose = require('mongoose');

/**
 * Expense Schema
 * 
 * Represents a financial transaction/expense belonging to an authenticated user.
 * Each expense must have a user owner and cannot be accessed by other users.
 * Supports categorization, payment methods, and detailed tracking.
 */
const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Expense must belong to a user'],
      index: true, // Index for faster queries of user expenses
    },
    title: {
      type: String,
      required: [true, 'Expense title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title must not exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      validate: {
        validator: (v) => v > 0,
        message: 'Amount must be greater than 0',
      },
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
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer', 'Cheque', 'Other'],
      default: 'Cash',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes must not exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Expense', expenseSchema);
