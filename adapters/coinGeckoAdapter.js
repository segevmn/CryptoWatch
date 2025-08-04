const axios = require('axios');

const client = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 10_000,
});

/**
 * מביא שערים עכשוויים למטבעות ע"פ מזהי CoinGecko.
 * @param {string[]} ids  –  ['bitcoin','ethereum']
 * @param {string[]} vs   –  ['usd','ils']
 * @returns {Promise<Object>} map  { bitcoin: { usd: 64000, ils: 215000 } }
 */
async function fetchCurrentPrices(ids, vs) {
  const { data } = await client.get('/simple/price', {
    params: { ids: ids.join(','), vs_currencies: vs.join(',') },
  });
  return data;
}

module.exports = { fetchCurrentPrices };
