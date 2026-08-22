const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token for authenticated user.
 * 
 * @param {string} userId - The user's MongoDB ObjectId
 * @param {string} role - The user's role (user or admin)
 * @returns {string} Signed JWT token
 */
const generateToken = (userId, role) => {
  const payload = {
    id: userId,
    role: role,
  };

  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRY || '7d';

  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verifies a JWT token.
 * 
 * @param {string} token - The JWT token to verify
 * @returns {object} Decoded token payload if valid
 * @throws {Error} If token is invalid or expired
 */
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken,
};
