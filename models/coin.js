const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const coinSchema = new Schema({
  coinId: { type: String, required: true },
  symbol: String,
  name: String,
});

module.exports = coinSchema;
