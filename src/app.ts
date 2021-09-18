import express, { Express, Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { router } from './routes';
import { AppError } from './errors/AppError';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swagger.json';

export class App {
  private _server: Express;

  constructor() {
    this._server = express();
    this._server.use(express.json());
    this._server.set('host', process.env.HOST || 'localhost');
    this._server.set('port', process.env.PORT || 4444);

    this._server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    this._server.use('/v1', router);
    this._server.get('/terms', (request, response) => {
      return response.json({
        message: 'Terms of Service',
      });
    });

    this._server.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
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
  }

  public startServer(): void {
    const host: string = this._server.get('host');
    const port: number = this._server.get('port');

    this._server.listen(port, host, () => {
      console.log(`The server started running at http://${host}:${port}`);
    });
  }
}
