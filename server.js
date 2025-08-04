/**
 * server.js
 * Entry point for the Express server
 *
 * Responsibilities:
 * - Load environment variables using dotenv
 * - Establish a connection to MongoDB using Mongoose
 * - Start the server on the specified PORT
 *
 * Exits with an error if the MongoDB URI is missing or the connection fails.
 * Logs environment mode and port if successful.
 */

// server.js — Entry point to start the Express application
// Establishes MongoDB connection and starts the server on defined PORT
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const { getEnvVar } = require('./config');
const app = require('./app');

// Load environment variables
const NODE_ENV = getEnvVar('NODE_ENV', 'development');
const MONGODB_URI = getEnvVar('MONGODB_URI');
const PORT = getEnvVar('PORT', 8080);

// Validate MongoDB connection string
if (!MONGODB_URI) {
  logger.error('MONGODB_URI is not defined in the environment variables.');
  process.exit(1);
}
// Connect to MongoDB and start the server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    /**
     * Starts the Express server.
     * @param {number} PORT - Port number from environment.
     * @returns {void}
     */
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${NODE_ENV} mode`);
    });
  })
  .catch(err => {
    logger.error('MongoDB connection error:', err);
  });
