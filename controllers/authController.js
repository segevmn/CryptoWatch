/**
 * auth.js
 * Controller for handling authentication logic.
 *
 * This file defines route logic for:
 * - Input validation
 * - Database queries
 * - Response formatting
 */

const authService = require('../services/authService');
const logger = require('../utils/logger');
const { getEnvVar } = require('../config');

exports.getLogin = (req, res, next) => {
  res.status(200).json({});
};

exports.getSignup = (req, res, next) => {
  res.status(200).json({});
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await authService.login(email, password);
    const NODE_ENV = getEnvVar('NODE_ENV', 'development');
    res
      .cookie('token', user.token, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(200)
      .json({ message: 'Login successful' });
  } catch (err) {
    logger.error(`Login failed for user ${email}: ${err.message}`);
    res.status(401).json({
      message: 'Invalid email or password',
    });
  }
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await authService.register(email, password);
    const NODE_ENV = getEnvVar('NODE_ENV', 'development');
    res.cookie('token', user.token, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    logger.error(`Signup failed for user ${email}: ${err.message}`);
    res.status(422).json({
      message: 'User already exists or invalid data',
    });
  }
};
