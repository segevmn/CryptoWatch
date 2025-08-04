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

exports.getWatchlist = async (req, res, next) => {
  try {
    const userId = req.userId;
    const userWatchlist = await userService.getUserWatchlist(userId);

    res.status(200).json({ watchlist: userWatchlist });
  } catch (err) {
    next(err);
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
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    await userService.deleteUser(userId);

    res.status(200).json({ msg: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};
