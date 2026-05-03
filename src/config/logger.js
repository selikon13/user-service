const pino = require('pino');
const config = require('./env');

const transport = config.isProduction
  ? undefined
  : {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname'
      }
    };

const logger = pino({
  level: process.env.LOG_LEVEL || (config.isTest ? 'silent' : 'info'),
  redact: {
    paths: [
      'req.headers.authorization',
      'password',
      'body.password',
      '*.password'
    ],
    censor: '[REDACTED]'
  },
  transport
});

module.exports = logger;
