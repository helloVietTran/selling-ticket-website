import express, { Application, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';


import route from './routes';
import { AppDataSource } from './config/data-source';
import { responseErr } from './config/exception';

const app: Application = express();

// middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


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

// handle global error
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  responseErr(err, res);
  return next();
});

// test endpoint
app.get('/ping', (req: Request, res: Response) => {
  res.send('pong');
});

export default app;
