const { verifyToken } = require('../utils/tokenUtils');

/**
 * Authentication Middleware
 * 
 * Verifies JWT from Authorization header (Bearer token).
 * Extracts user information and attaches to request.
 * If token is missing, invalid, or expired, rejects the request.
 * 
 * Usage: app.use(protect) or router.use(protect) before protected routes
 */
const protect = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyToken(token);

    // Attach user info to request for use in controllers/routes
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
      });
    }

    res.status(401).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

/**
 * Role-Based Authorization Middleware
 * 
 * Checks if authenticated user has the required role.
 * Must be used AFTER protect middleware.
 * 
 * Usage: router.get('/admin', protect, authorize('admin'), controllerFn)
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
};
