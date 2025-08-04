/**
 * watchlist.js
 * Mongoose schema definition for user watchlist entries.
 */

const mongoose = require('mongoose');
const coinSchema = require('./coin'); // Importing the coin schema

const Schema = mongoose.Schema;

const watchlistSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  coins: [coinSchema],
});

module.exports = mongoose.model('Watchlist', watchlistSchema);
