const logger = require('../config/logger');
const config = require('../config/env');

function errorMiddleware(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  logger.error({
    requestId: req.id,
    statusCode,
    err: error
  }, 'Request failed');

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    details: error.details || undefined,
    requestId: req.id,
    stack: config.isProduction ? undefined : error.stack
  });
}

module.exports = errorMiddleware;
