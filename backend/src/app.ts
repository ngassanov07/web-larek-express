import express, { ErrorRequestHandler, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { isCelebrateError } from 'celebrate';
import expressWinston from 'express-winston';
import winston from 'winston';
import connectDB from './config/db';
import productRouter from './routes/product';
import orderRouter from './routes/orders';
import { errorHandler } from './middlewares/errorHandler';
import { BadRequestError, NotFoundError } from './errors/ApiError';

dotenv.config();

connectDB();

const PORT = process.env.PORT || 3000;
const app = express();

const celebrateErrorHandler: ErrorRequestHandler = (err, _req, _res, next) => {
  if (isCelebrateError(err)) {
    const message = [...err.details.values()]
      .map((validationError) => validationError.message)
      .join(', ');

    return next(new BadRequestError(message));
  }

  return next(err);
};

app.use(cors({
  origin: process.env.ORIGIN_ALLOW,
}));

app.use(expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'logs/request.log' }),
  ],
  format: winston.format.json(),
  requestWhitelist: ['method', 'url'],
  responseWhitelist: ['statusCode'],
}));

app.use(express.json());

app.use(orderRouter);

app.use(
  '/images',
  express.static(path.join(__dirname, '../public/images')),
);

app.use(productRouter);

app.get('/', (_req: Request, res: Response) => {
  res.send('TS API is running... ');
});

app.use((_req, _res, next) => next(new NotFoundError('Route not found')));

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'logs/error.log' }),
  ],
  format: winston.format.json(),
}));

app.use(celebrateErrorHandler);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
