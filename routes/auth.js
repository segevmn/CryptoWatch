/**
 * auth.js
 * Express router for handling authentication routes.
 *
 * Maps HTTP endpoints to controller methods.
 */

const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

const authController = require('../controllers/authController');

const router = express.Router();

/**
 * GET /login - Returns the login page.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
router.get('/login', authController.getLogin);

/**
 * POST /login - Authenticates user credentials.
 * @param {Object} req - Should contain email and password in body.
 * @param {Object} res
 * @param {Function} next
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  authController.postLogin
);

/**
 * POST /logout - Logs out the user.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
router.post('/logout', authController.postLogout);

/**
 * GET /signup - Returns the signup page.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
router.get('/signup', authController.getSignup);

/**
 * POST /signup - Registers a new user.
 * @param {Object} req - Contains email and password.
 * @param {Object} res
 * @param {Function} next
 */
router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  authController.postSignup
);

module.exports = router;
