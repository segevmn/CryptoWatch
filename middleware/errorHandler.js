const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  logger.error(`${req.method} ${req.originalUrl} — ${err.message}`);
  const status = err.status || (err.name === 'ValidationError' ? 400 : 500);
  res.status(status).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
