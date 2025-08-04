const Watchlist = require('../models/watchlist');

async function findWatchlistByUserId(userId) {
  return await Watchlist.findOne({ userId });
}

async function createWatchlist(userId) {
  const watchlist = new Watchlist({ userId, coins: [] });
  return await watchlist.save();
}

async function updateWatchlist(watchlist) {
  return await watchlist.save();
}

async function deleteWatchlistByUserId(userId) {
  return await Watchlist.deleteOne({ userId });
}

module.exports = {
  findWatchlistByUserId,
  createWatchlist,
  updateWatchlist,
  deleteWatchlistByUserId,
};
