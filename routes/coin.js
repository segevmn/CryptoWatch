const express = require('express');

const coinController = require('../controllers/coin');
const { isAuth } = require('../middleware/is-auth');

const router = express.Router();

router.get('/cryptos', isAuth, coinController.getCoins);

router.get('/cryptos/:id', isAuth, coinController.getCoin);

router.get('/currencies', isAuth, coinController.getCurrentCryptoRates);

router.get('/history/:id', isAuth, coinController.getHistoricalCharts);

router.post('/cryptos', isAuth, coinController.addCoinToWatchlist);

module.exports = router;
