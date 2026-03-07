import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { getConnectionState } from './config/database';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app: Express = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

if (env.NODE_ENV !== 'test') {
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
      success: false,
      error: { code: 'RATE_LIMIT', message: 'Too many requests' },
    },
  });
  app.use('/api/v1/auth', authLimiter);
}

app.use('/api/v1', routes);

app.get('/health', (_req, res) => {
  const db = getConnectionState();
  res.status(db.ready ? 200 : 503).json({
    status: db.ready ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    database: db,
  });
});

app.use(errorHandler);

export { app };
