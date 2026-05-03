const app = require('./app');
const { initDatabase } = require('./config/db');
const config = require('./config/env');
const logger = require('./config/logger');

initDatabase();

const server = app.listen(config.port, () => {
  logger.info(`Server started on http://localhost:${config.port}`);
});

function shutdown(signal) {
  logger.info({ signal }, 'Graceful shutdown started');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
