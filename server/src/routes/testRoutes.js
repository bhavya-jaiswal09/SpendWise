const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Protected Test Routes
 * 
 * These endpoints exist solely to verify that JWT authentication middleware works.
 * They will be removed in future phases as real application routes are added.
 */

// GET /api/test/protected - Verify basic authentication
router.get('/protected', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authentication verified',
    data: {
      user: {
        id: req.user.id,
        role: req.user.role,
      },
    },
  });
});

// GET /api/test/admin - Verify admin role authorization
router.get('/admin', protect, authorize('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin access granted',
    data: {
      user: {
        id: req.user.id,
        role: req.user.role,
      },
    },
  });
});

module.exports = router;
