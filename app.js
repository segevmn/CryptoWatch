/**
 * app.js
 * Express Application Configuration
 *
 * This file sets up the Express server with middleware, routing, CORS, logging,
 * error handling, and environment-specific behavior.
 *
 * Middleware:
 * - body-parser: Parses incoming request bodies in JSON format.
 * - cors: Restricts access to defined origins.
 * - morgan: Logs HTTP requests to the console.
 *
 * Routing:
 * - /coingecko - Crypto currency endpoints
 * - /auth - Authentication routes
 * - /user - User-related routes
 *
 * Global error handling:
 * - Captures errors and returns structured JSON response.
 * - Uses errorhandler in development for better stack traces.
 */

// app.js — Express configuration file
// Handles middleware setup, API routing, error handling, and security configuration (CORS, etc.)
const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const logger = require('./utils/logger');
const { getEnvVar } = require('./config');
const apiErrorHandler = require('./middleware/errorHandler');

// Set up environment variables
const NODE_ENV = getEnvVar('NODE_ENV', 'development');
const CORS_WHITELIST = getEnvVar('CORS_WHITELIST', '');

const app = express();
app.use(cookieParser());

// ✅ Enable response compression to reduce payload size
app.use(compression({ threshold: 100 * 1024 }));

// ✅ Security middlewares
app.use(helmet());

// ✅ Rate limiting middleware to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Send RateLimit headers
  legacyHeaders: false,
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

// ✅ Morgan HTTP request logger
app.use(
  morgan(NODE_ENV === 'development' ? 'dev' : 'combined', {
    stream: { write: msg => logger.info(msg.trim()) },
  })
);

// ✅ Check if CORS_WHITELIST is defined
if (!CORS_WHITELIST) {
  logger.error('CORS_WHITELIST is not defined in the environment variables.');
  process.exit(1);
}
// Build whitelist array from comma-separated string or allow all
const whitelist = CORS_WHITELIST === '*' ? true : CORS_WHITELIST.split(',');

// ✅ CORS configuration
// Configure CORS to restrict access based on whitelist
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist === true || !origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// ✅ Import and use API routes
const apiRoutes = require('./routes');

// Use the imported routes
app.use(apiRoutes);

// ✅ Global error handling middleware
app.use(apiErrorHandler);

// Error handling middleware for development environment
// ✅ Development error stacktrace
if (NODE_ENV === 'development') {
  app.use(errorHandler());
}

module.exports = app;
