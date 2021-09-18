import { App } from './app';
import { createConnection } from 'typeorm';
import 'reflect-metadata';
import * as dotenv from 'dotenv';

dotenv.config();
createConnection()
  .then(() => {
    const application: App = new App();
    application.startServer();
  })
  .catch((error) => console.log('Unexpected error:', error));
