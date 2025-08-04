/**
 * coin.js
 * Express router for handling cryptocurrency data routes.
 *
 * Maps HTTP endpoints to controller methods.
 */

const express = require('express');

const coinController = require('../controllers/coinController');
const { isAuth } = require('../middleware/is-auth');

// ✅ express‑validator
const { param, query } = require('express-validator');
const validate = require('../middleware/validate');

const router = express.Router();

/**
 * GET /coingecko/cryptos - Fetches a list of all available cryptocurrencies.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
router.get('/cryptos', isAuth, coinController.getCoins);

/**
 * GET /coingecko/cryptos/:id - Fetches details of a specific cryptocurrency.
 * @param {Object} req - Must include :id param.
 * @param {Object} res
 * @param {Function} next
 */
router.get('/cryptos/:id', isAuth, coinController.getCoin);

/**
 * GET /coingecko/current - Returns current crypto rates for specified symbols.
 * @param {Object} req - Expects 'symbols' query parameter.
 * @param {Object} res
 * @param {Function} next
 */
router.get(
  '/currencies',
  isAuth,
  [
    query('ids').notEmpty().withMessage('ids are required'),
    query('vs_currencies').notEmpty().withMessage('vs_currencies are required'),
  ],
  validate,
  coinController.getCurrentCryptoRates
);

/**
 * GET /coingecko/history/:id - Returns historical chart data.
 * @param {Object} req - Query must include currency and days.
 * @param {Object} res
 * @param {Function} next
 */
router.get(
  '/history/:id',
  isAuth,
  [
    param('id').notEmpty().withMessage('id is required'),
    query('vs_currency').notEmpty().withMessage('vs_currency is required'),
    query('days').isInt({ min: 1 }).withMessage('days must be an integer > 0'),
  ],
  validate,
  coinController.getHistoricalCharts
);

module.exports = router;
