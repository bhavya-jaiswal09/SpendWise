/**
 * Basic centralized error-handling middleware.
 * Future phases can extend this (e.g. custom error classes,
 * validation error formatting, etc.) without changing how
 * routes/controllers throw errors.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err.message);

  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

/**
 * Handles requests to routes that don't exist.
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFound };
