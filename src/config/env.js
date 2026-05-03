require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest,
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || (isTest ? 'test_secret' : undefined),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  dbPath: process.env.DB_PATH || (isTest ? ':memory:' : 'database.sqlite'),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 100)
};

if (!config.jwtSecret) {
  throw new Error('JWT_SECRET is required');
}

module.exports = config;
