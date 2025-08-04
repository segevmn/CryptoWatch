/**
 * user.js
 * Controller for handling user data and watchlist logic.
 *
 * This file defines route logic for:
 * - Input validation
 * - Database queries
 * - Response formatting
 */

const userService = require('../services/userService');
const logger = require('../utils/logger');

exports.getWatchlist = async (req, res, next) => {
  try {
    const userId = req.userId;
    const userWatchlist = await userService.getUserWatchlist(userId);

    res.status(200).json({ watchlist: userWatchlist });
  } catch (err) {
    res
      .status(err.message.includes('No watchlist entries') ? 404 : 500)
      .json({ errmsg: err.message });
  }
};

exports.addToWatchlist = async (req, res, next) => {
  try {
    const { coinId, name, symbol } = req.body;
    const userId = req.userId;

    const updatedWatchlist = await userService.addCoinToWatchlist(userId, {
      coinId,
      name,
      symbol,
    });

    res.status(201).json({
      msg: 'coin was added to watchlist',
      watchlist: updatedWatchlist,
    });
  } catch (err) {
    logger.error(`Error adding coin to watchlist: ${err.message}`);
    res.status(500).json({ errMessage: 'Error adding coin to watchlist' });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    await userService.deleteUser(userId);

    res.status(200).json({ msg: 'User deleted successfully' });
  } catch (err) {
    logger.error(`Error deleting user: ${err.message}`);
    res.status(500).json({ errMessage: 'Error deleting user' });
  }
};
