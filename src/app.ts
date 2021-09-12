import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { createConnection } from 'typeorm';
import { router } from './routes';
import 'reflect-metadata';
import { AppError } from './errors/AppError';
import * as dotenv from 'dotenv';

dotenv.config();
createConnection();

const app = express();

app.use(express.json());
app.use('/v1', router);
app.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      message: err.message,
    });
  }

  return response.status(500).json({
    status: 'Error',
    message: `Internal server error ${err.message}`,
  });
});

app.get('/terms', (request, response) => {
  return response.json({
    message: 'Terms of Service',
  });
});

export { app };
