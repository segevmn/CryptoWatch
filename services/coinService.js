const fetch = require('node-fetch');

const { getEnvVar } = require('../config');

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
    const response = await fetch(
      `${baseURL}/simple/price?ids=${symbols}&vs_currencies=usd`
    );
    if (!response.ok) throw new Error('Failed to fetch current crypto rates');
    return await response.json();
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
