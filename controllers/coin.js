const Watchlist = require('../models/watchlist');

exports.getCoins = async (req, res, next) => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/list');

    if (!response.ok)
      return res.status(400).json({ msg: 'Problem fetching coins from API' });

    const geckoCoins = await response.json();

    res.status(200).json(geckoCoins);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errMessage: 'Error', details: err.message });
  }
};

exports.getCoin = async (req, res, next) => {
  const coinId = req.params.id;

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}`
    );
    if (!response.ok)
      return res.status(404).json({ msg: 'Coin was not found in the API' });

    const geckoCoin = await response.json();

    const filteredCoin = {
      id: geckoCoin.id,
      symbol: geckoCoin.symbol,
      name: geckoCoin.name,
      platforms: geckoCoin.platforms,
    };

    res.status(200).json(filteredCoin);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errMessage: 'Error', details: err.message });
  }
};

exports.getCurrentCryptoRates = async (req, res, next) => {
  try {
    const currency = req.query.vs_currencies;
    const currIds = req.query.ids;

    if (!currency)
      return res
        .status(400)
        .json({ msg: 'The currency paramater is required' });

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?vs_currencies=${currency}&ids=${currIds}`
    );
    if (!response.ok)
      return res.status(404).json({ msg: 'Error retrieving cureents rates' });

    const currentCryptorates = await response.json();

    res.status(200).json({ currentCryptorates });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errMessage: 'Error', details: err.message });
  }
};

exports.getHistoricalCharts = async (req, res, next) => {
  try {
    const currencyID = req.params.id;
    const currency = req.query.vs_currency;
    const daysAgo = req.query.days;

    if (!currencyID || !currency || !daysAgo)
      return res
        .status(400)
        .json({ msg: 'The currency, Id and days paramaters are required' });

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${currencyID}/market_chart?vs_currency=${currency}&days=${daysAgo}`
    );

    if (!response.ok)
      return res.status(404).json({ msg: 'Error fetching coin history' });

    const history = await response.json();
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ errMessage: 'Error', details: err.message });
  }
};

exports.addCoinToWatchlist = async (req, res, next) => {
  try {
    const coinId = req.body.coin;
    const coinSymbol = req.body.symbol;
    const coinName = req.body.name;
    const userId = req.userId;

    if (!coinId || !coinSymbol || !coinName)
      return res
        .status(409)
        .json({ msg: 'coin Id, symbol, and name are needed!' });

    const coinInWatchlist = await Watchlist.findOne({ userId, coinId });
    if (coinInWatchlist)
      return res.status(409).json({ msg: 'Coin already exists' });

    const newWatchlistCoin = new Watchlist({
      userId: userId,
      coin: coinId,
      symbol: coinSymbol,
      name: coinName,
    });
    await newWatchlistCoin.save();
    res
      .status(201)
      .json({ msg: 'coin was added to watchlist', coinData: newWatchlistCoin });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errMessage: 'Error adding coin to watchlist' });
  }
};
