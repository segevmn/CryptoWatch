const fetch = require('node-fetch');

const { getEnvVar } = require('../config');
const { fetchCurrentPrices } = require('../adapters/coinGeckoAdapter');
const { withCache } = require('../utils/simpleCache');

const fetchCurrentPricesCached = withCache(fetchCurrentPrices, 30);

const baseURL = getEnvVar('COINGECKO_API_URL');

const coinService = {
  getAllCoins: async () => {
    const response = await fetch(`${baseURL}/coins/list`);
    if (!response.ok) throw new Error('Failed to fetch coins list');
    return await response.json();
  },

  getCoinById: async id => {
    const response = await fetch(`${baseURL}/coins/${id}`);
    if (!response.ok) throw new Error('Failed to fetch coin');
    return await response.json();
  },

  getCurrentCryptoRates: async symbols => {
    const ids = symbols.split(',');
    const response = await fetchCurrentPricesCached(ids, ['usd']);
    return response;
  },

  getHistoricalCharts: async (id, vs_currency, days) => {
    const response = await fetch(
      `${baseURL}/coins/${id}/market_chart?vs_currency=${vs_currency}&days=${days}`
    );
    if (!response.ok) throw new Error('Failed to fetch historical charts');
    return await response.json();
  },
};

module.exports = coinService;
