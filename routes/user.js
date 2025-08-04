/**
 * user.js
 * Express router for handling user data and watchlist routes.
 *
 * Maps HTTP endpoints to controller methods.
 */

const express = require('express');

const userController = require('../controllers/userController');
const { isAuth } = require('../middleware/is-auth');

// ✅ express‑validator
const { body } = require('express-validator');
const validate = require('../middleware/validate');

const router = express.Router();

/**
 * GET /users/watchlist - Gets the authenticated user's watchlist.
 * @param {Object} req - Authenticated request (JWT required).
 * @param {Object} res
 * @param {Function} next
 */
router.get('/watchlist', isAuth, userController.getWatchlist);

/**
 * POST /users/watchlist - Adds coin to authenticated user's watchlist.
 * @param {Object} req - Body should include coinId and name.
 * @param {Object} res
 * @param {Function} next
 */
router.post(
  '/watchlist',
  isAuth,
  [
    body('coinId').notEmpty().withMessage('coinId is required'),
    body('name').notEmpty().withMessage('name is required'),
  ],
  validate,
  userController.addToWatchlist
);

/**
 * DELETE /users/me - Deletes the authenticated user.
 * @param {Object} req - Authenticated request (JWT required).
 * @param {Object} res
 * @param {Function} next
 * @returns {Object} - Confirmation message.
 */
router.delete('/me', isAuth, userController.deleteUser);

module.exports = router;
