const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const watchlistSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  coin: { type: String, required: true },
  symbol: String,
  name: String,
});

module.exports = mongoose.model('Watchlist', watchlistSchema);
