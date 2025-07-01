import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import apiRoutes from './apiRoutes';

function createServer() {
  return express();
}

function setupMiddlewares(app) {
  app.use(helmet());
  app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
}

function setupRoutes(app) {
  app.use('/api', apiRoutes);
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
}

function startServer(app) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'production'} mode on port ${port}`);
  });
}

const app = createServer();
setupMiddlewares(app);
setupRoutes(app);
startServer(app);