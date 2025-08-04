/**
 * coin.js
 * Controller for handling cryptocurrency data logic.
 *
 * This file defines route logic for:
 * - Input validation
 * - Database queries
 * - Response formatting
 */

const coinService = require('../services/coinService');
const logger = require('../utils/logger');

exports.getCoins = async (req, res, next) => {
  try {
    const response = await coinService.getAllCoins();

    res.status(200).json(response);
  } catch (err) {
    logger.error(`Error fetching coins: ${err.message}`);
    res.status(500).json({ errMessage: 'Error', details: err.message });
  }
};

exports.getCoin = async (req, res, next) => {
  try {
    const response = await coinService.getCoinById(req.params.id);
    res.status(200).json(response);
  } catch (err) {
    logger.error(
      `Error fetching coin with ID ${req.params.id}: ${err.message}`
    );
    res.status(500).json({ errMessage: 'Error', details: err.message });
  }
};

exports.getCurrentCryptoRates = async (req, res, next) => {
  try {
    const currIds = req.query.ids;

    const response = await coinService.getCurrentCryptoRates(currIds);

    res.status(200).json({ currentCryptorates: response });
  } catch (err) {
    logger.error(`Error fetching current crypto rates: ${err.message}`);
    res.status(500).json({ errMessage: 'Error', details: err.message });
  }
};

exports.getHistoricalCharts = async (req, res, next) => {
  try {
    const currencyID = req.params.id;
    const currency = req.query.vs_currency;
    const daysAgo = req.query.days;

    const response = await coinService.getHistoricalCharts(
      currencyID,
      currency,
      daysAgo
    );

    res.status(200).json({ history: response });
  } catch (err) {
    res.status(500).json({ errMessage: 'Error', details: err.message });
  }
};
