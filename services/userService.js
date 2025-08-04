const userDataAccess = require('../data-access/userDA');
const watchlistDataAccess = require('../data-access/watchlistDA');
const logger = require('../utils/logger');
const { NotFoundError, ValidationError } = require('../utils/errors');

const userService = {
  getUserWatchlist: async userId => {
    const watchlistEntries = await watchlistDataAccess.findWatchlistByUserId(
      userId
    );
    if (!watchlistEntries) {
      throw NotFoundError('No watchlist entries found for this user');
    }
    return watchlistEntries.coins;
  },

  addCoinToWatchlist: async (userId, coin) => {
    let watchlist = await watchlistDataAccess.findWatchlistByUserId(userId);

    if (!watchlist) {
      watchlist = await watchlistDataAccess.createWatchlist(userId);
    }

    if (watchlist.coins.some(c => c.id === coin.id)) {
      throw ValidationError('Coin is already in watchlist');
    }

    watchlist.coins.push(coin);

    return await watchlistDataAccess.updateWatchlist(watchlist);
  },

  deleteUser: async userId => {
    const result = await userDataAccess.deleteUserById(userId);
    if (result.deletedCount === 0) {
      throw NotFoundError('User not found');
    }
    await watchlistDataAccess.deleteWatchlistByUserId(userId);
    logger.info(`User ${userId} and watchlist deleted`);
  },
};

module.exports = userService;
