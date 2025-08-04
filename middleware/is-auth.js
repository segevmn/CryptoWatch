/**
 * is-auth.js
 * Custom Express middleware for JWT token authentication.
 */

const jwt = require('jsonwebtoken');

const logger = require('../utils/logger');
const { getEnvVar } = require('../config');

const JWT_SECRET = getEnvVar('JWT_SECRET');

/**
 * Middleware: Verifies if request has a valid token.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.isAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: 'No token provided' });

    // Verify the token using JWT_SECRET
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decodedToken.id,
      email: decodedToken.email,
      role: decodedToken.role,
    };
    req.userId = decodedToken.id;
    next();
  } catch (err) {
    logger.error('JWT verification failed:', err.message);
    res.status(401).json({ message: 'Token verification failed' });
  }
};
