const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const dailyRotate = new transports.DailyRotateFile({
  dirname: 'logs',
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
});

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console({ format: format.simple() }),
    dailyRotate,
  ],
});

module.exports = logger;
