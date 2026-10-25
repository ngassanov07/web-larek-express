import { ErrorRequestHandler } from 'express';
import { ApiError } from '../errors/ApiError';

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) return next(error);

  const status = error instanceof ApiError ? error.statusCode : 500;
  const message = error instanceof ApiError
    ? error.message
    : 'Internal server error';

  return res.status(status).json({ message });
};
