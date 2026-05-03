const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const pinoHttp = require('pino-http');
const path = require('path');

const config = require('./config/env');
const logger = require('./config/logger');
const requestIdMiddleware = require('./middleware/request-id.middleware');
const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

app.disable('x-powered-by');
app.use(requestIdMiddleware);
app.use(pinoHttp({ logger, genReqId: req => req.id }));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors({ origin: config.corsOrigin === '*' ? true : config.corsOrigin }));
app.use(express.json({ limit: '100kb' }));

app.use(rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Слишком много запросов, попробуйте позже' }
}));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', requestId: req.id });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', requestId: req.id });
});

app.use(errorMiddleware);

module.exports = app;
