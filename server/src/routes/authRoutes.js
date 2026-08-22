const express = require('express');
const {
  register,
  login,
  logout,
  getCurrentUser,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Public Routes
 */

// POST /api/auth/register - Register a new user
router.post('/register', register);

// POST /api/auth/login - Login user
router.post('/login', login);

// POST /api/auth/logout - Logout user (frontend-driven)
router.post('/logout', logout);

/**
 * Protected Routes
 */

// GET /api/auth/me - Get current authenticated user (for session restoration)
router.get('/me', protect, getCurrentUser);

module.exports = router;
