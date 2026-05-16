const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const routes = require('./routes');
const { env } = require('./config/env');
const { errorHandler } = require('./middleware/error-handler');

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.clientOrigin === '*' ? true : env.clientOrigin,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(morgan('dev'));

  app.use('/api', routes);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
