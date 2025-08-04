/**
 * adminController.js
 * Controller for handling admin operations.
 * This file defines route logic for:
 * - Deleting users
 */
const userService = require('../services/userService');
const logger = require('../utils/logger');

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await userService.deleteUser(userId);

    res.status(200).json({ msg: 'User deleted successfully' });
  } catch (err) {
    logger.error(`Error deleting user: ${err.message}`);
    next(err);
  }
};
