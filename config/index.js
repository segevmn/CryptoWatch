require('dotenv').config();

/**
 * Returns environment variable
 * throws error if missing value (unless defaultValue was provided).
 * Converts PORT automatically to a number
 */

function getEnvVar(key, defaultValue) {
  const val = process.env[key];
  if (val !== undefined) return key === 'PORT' ? Number(val) : val;
  if (defaultValue !== undefined) return defaultValue;
  throw new Error(`Missing required env var: ${key}`);
}

module.exports = { getEnvVar };
