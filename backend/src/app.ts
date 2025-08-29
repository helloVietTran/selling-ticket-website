import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import eventRoutes from "./routes/event.route";

import route from './routes';
import { AppDataSource } from './config/data-source';

const app: Application = express();

// middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use('/api/v1/events', eventRoutes);
// routes
route(app);

// connect to db
AppDataSource.initialize()
  .then(() => {
    console.log('INFO: Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('ERROR: Error during Data Source initialization:', err);
  });

// test endpoint
app.get('/ping', (req: Request, res: Response) => {
  res.send('pong');
});

export default app;